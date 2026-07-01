const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const multer = require("multer")

// Configure Cloudinary Credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINRY_ID || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINRY_API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret:
    process.env.CLOUDINRY_API_SECRET || process.env.CLOUDINARY_API_SECRET,
})

// Setup Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/")

    return {
      folder: "products",
      resource_type: isVideo ? "video" : "image",
      format: isVideo ? undefined : "webp",
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    }
  },
})

// File Validation Filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true)
  } else {
    cb(
      new Error("Invalid file type! Only images and videos are allowed."),
      false,
    )
  }
}
// upload single file from client
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 },
  fileFilter: fileFilter,
})

module.exports = { storage, upload, uploadMultiple: upload }
