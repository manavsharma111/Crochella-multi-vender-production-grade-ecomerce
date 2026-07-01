const cloudinary = require("cloudinary").v2
const { upload } = require("../config/cloudinary")

const uploadBulkMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length == 0) {
      return res.status(400).json({ message: "No files uploaded" })
    }

    const mediaData = req.files.map((file) => ({
      url: file.path,
      type: file.mimetype.startsWith("video/") ? "video" : "image",
    }))

    res
      .status(200)
      .json({ message: "Files uploaded successfully", data: mediaData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

const deleteMedia = async (req, res) => {
  try {
    const { public_id } = req.body
    if (!public_id) {
      return res.status(400).json({ message: "Public ID is required" })
    }
    const result = await cloudinary.uploader.destroy(public_id)
    if (result.result !== "ok") {
      return res.status(500).json({ message: "Failed to delete media" })
    }
    res.status(200).json({ message: "Media deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

const singleMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }
    const mediaData = {
      url: req.file.path,
      type: req.file.mimetype.startsWith("video/") ? "video" : "image",
    }
    res
      .status(200)
      .json({ message: "File uploaded successfully", data: mediaData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

module.exports = { uploadBulkMedia, deleteMedia, singleMedia }
