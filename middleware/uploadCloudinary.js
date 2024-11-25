const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("img/");
    const isVideo = file.mimetype.startsWith("video/");

    if (!isImage && !isVideo) {
      throw new Error("File not supported");
    }

    return {
      folder: "SICILIAN-TASTE-SERVER-UPLOADS",
      allowed_formats: ["jpg", "png", "gif", "mp4", "mov", "avi", "hevc"],
      resource_type: isVideo ? "video" : "img",
      public_id: file.originalname.split(".")[0],
    };
  },
});

const cloud = multer({ storage: cloudStorage });

module.exports = cloud;