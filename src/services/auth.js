import crypto from "crypto";
import { Session } from "../models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/time.js";

/**
 * Create random token
 */
const genToken = (size = 48) => crypto.randomBytes(size).toString("hex");

/**
 * Create session document - returns saved session
 */
export const createSession = async (userId) => {
  const accessToken = genToken(24);
  const refreshToken = genToken(48);

  const now = Date.now();
  const accessTokenValidUntil = new Date(now + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(now + ONE_DAY);

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

/**
 * Set three cookies on response: accessToken, refreshToken, sessionId
 * cookieOptions: httpOnly, secure, sameSite, maxAge
 *
 * NOTE: for local dev behind http, set COOKIE_SECURE=false in .env
 */
export const setSessionCookies = (res, session, { secure = true } = {}) => {
  const accessCookieOptions = {
    httpOnly: true,
    secure,
    sameSite: "none",
    maxAge: FIFTEEN_MINUTES,
  };
  const refreshCookieOptions = {
    httpOnly: true,
    secure,
    sameSite: "none",
    maxAge: ONE_DAY,
  };
  const sessionCookieOptions = {
    httpOnly: true,
    secure,
    sameSite: "none",
    maxAge: ONE_DAY,
  };

  res.cookie("accessToken", session.accessToken, accessCookieOptions);
  res.cookie("refreshToken", session.refreshToken, refreshCookieOptions);
  res.cookie("sessionId", session._id.toString(), sessionCookieOptions);
};
