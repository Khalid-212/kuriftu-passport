const cloudinary = require("../config/cloudinary");
const path = require("path");

/**
 * Upload an image to Cloudinary
 * @param {Object} file - The file object from multer
 * @param {String} folder - The folder to upload to in Cloudinary
 * @returns {Promise<Object>} - The Cloudinary upload result
 */
const uploadToCloudinary = async (file, folder = "kuriftu-passport") => {
  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete an image from Cloudinary
 * @param {String} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - The deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
