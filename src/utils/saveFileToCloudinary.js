// src/utils/saveFileToCloudinary.js
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Завантажує файл у Cloudinary з буфера без збереження на диск
 * @param {Buffer} buffer - буфер файлу
 * @returns {Promise<object>} - результат завантаження від Cloudinary
 */
export const saveFileToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "avatars",
      resource_type: "image", // ✅ вказуємо тип ресурсу
      overwrite: true, // ✅ дозволяємо перезапис (за потреби)
      unique_filename: true, // ✅ Cloudinary сам створить унікальну назву
      use_filename: false, // ✅ не використовуємо оригінальне ім’я
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
