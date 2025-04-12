const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadToCloudinary } = require("../utils/uploadUtils");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, JPG, and GIF files are allowed."
      ),
      false
    );
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
});

/**
 * Middleware to handle file uploads and Cloudinary integration
 * @param {String} fieldName - The name of the file field in the form
 * @param {String} cloudinaryFolder - The folder to upload to in Cloudinary
 * @returns {Function} - Express middleware function
 */
const uploadToCloudinaryMiddleware = (
  fieldName,
  cloudinaryFolder = "kuriftu-passport"
) => {
  return async (req, res, next) => {
    try {
      // Use multer to handle the file upload
      upload.single(fieldName)(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err.message,
          });
        }

        if (!req.file) {
          return next();
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file, cloudinaryFolder);

        if (!result.success) {
          // Delete the local file if Cloudinary upload fails
          fs.unlinkSync(req.file.path);
          return res.status(500).json({
            success: false,
            message: "Failed to upload image to Cloudinary",
            error: result.error,
          });
        }

        // Add Cloudinary URL and public_id to the request
        req.cloudinaryResult = {
          url: result.url,
          public_id: result.public_id,
        };

        // Delete the local file after successful upload
        fs.unlinkSync(req.file.path);

        next();
      });
    } catch (error) {
      // Clean up the local file if there's an error
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        success: false,
        message: "Error processing file upload",
        error: error.message,
      });
    }
  };
};

module.exports = {
  upload,
  uploadToCloudinaryMiddleware,
};
