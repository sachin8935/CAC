const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const winston = require("winston");
const logger = require("../logger");

exports.cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    logger.info("Cloudinary initialized successfully.");
  } catch (err) {
    logger.error("Error initializing Cloudinary:", err);
  }
};
