const env = require("../../config/env");
const logger = require("../../utils/logger");

const uploadImage = async (file) => {
  const hasCloudinary =
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET;

  if (!hasCloudinary) {
    logger.info("Cloudinary credentials missing. Saving uploaded leaf file locally.");
    
    // Return relative local path accessible via Express static /uploads route
    return {
      url: `/uploads/${file.filename}`,
      publicId: file.filename
    };
  }

  // Cloudinary client call could be integrated here, for example:
  // const cloudinary = require('cloudinary').v2;
  // cloudinary.config({ cloud_name, api_key, api_secret });
  // const result = await cloudinary.uploader.upload(file.path);
  // return { url: result.secure_url, publicId: result.public_id };
  
  return {
    url: `/uploads/${file.filename}`,
    publicId: file.filename
  };
};

module.exports = {
  uploadImage
};
