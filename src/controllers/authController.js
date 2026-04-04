// src/controllers/authController.js
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { createSession, setSessionCookies } from "../services/auth.js";
import { sendEmail } from "../utils/sendMail.js";

const SALT_ROUNDS = 10;

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw createHttpError(400, "Email in use");
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email,
      password: hashed,
      username: name ?? email,
    });

    const session = await createSession(user._id);
    const secure = process.env.COOKIE_SECURE !== "false";
    setSessionCookies(res, session, { secure });

    res.status(201).json(user); // toJSON in model removes password
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, "User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw createHttpError(401, "Invalid credentials");

    // Remove old sessions for this user (optional)
    await Session.deleteMany({ userId: user._id });

    const session = await createSession(user._id);
    const secure = process.env.COOKIE_SECURE !== "false";
    setSessionCookies(res, session, { secure });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies || {};
    if (!sessionId || !refreshToken) {
      throw createHttpError(401, "Session not found");
    }

    const session = await Session.findById(sessionId);
    if (!session || session.refreshToken !== refreshToken) {
      throw createHttpError(401, "Session not found");
    }

    if (session.refreshTokenValidUntil < new Date()) {
      throw createHttpError(401, "Session token expired");
    }

    // delete old session
    await Session.findByIdAndDelete(sessionId);

    // create new session
    const newSession = await createSession(session.userId);
    const secure = process.env.COOKIE_SECURE !== "false";
    setSessionCookies(res, newSession, { secure });

    res.status(200).json({ message: "Session refreshed" });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies || {};
    if (sessionId) {
      await Session.findByIdAndDelete(sessionId);
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE !== "false",
      sameSite: "none",
    };

    res.clearCookie("sessionId", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// request reset email
export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const message = { message: "Password reset email sent successfully" };

    // always return same message to avoid email discovery
    if (!user) return res.status(200).json(message);

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetUrl = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password reset",
        templateName: "reset-password-email",
        context: { name: user.username || user.email, resetUrl },
      });
    } catch (err) {
      // log if needed
      return next(
        createHttpError(
          500,
          "Failed to send the email, please try again later."
        )
      );
    }

    return res.status(200).json(message);
  } catch (err) {
    next(err);
  }
};

// reset password using token
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw createHttpError(401, "Invalid or expired token");
    }

    const user = await User.findOne({ _id: payload.sub, email: payload.email });
    if (!user) throw createHttpError(404, "User not found");

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};
