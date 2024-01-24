const achivemodel = require("../models/achivmentsModel");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ADMIN_ROLE = "admin";
const SUPPORTED_FILE_TYPES = ["jpg", "jpeg", "png"];
exports.getAchivments = async (req, res) => {
  try {
    const response = await achivemodel.find({}).select("-dateCreated");
    res.status(200).json({
      success: true,
      data: response,
      message: "Entire achivment is fetched",
    });
  } catch (err) {
    console.error("Error in fetching data:", err);
    res.status(500).json({
      success: false,
      data: null,
      message: "Error in fetching data",
      error: err.message,
    });
  }
};
exports.getTop3Achivments = async (req, res) => {
  try {
    const response = await achivemodel
      .find({})
      .sort({ dateCreated: -1 })
      .limit(3)
      .select("-dateCreated");

    res.status(200).json({
      success: true,
      data: response,
      message: "Top 3 achievements fetched successfully",
    });
  } catch (err) {
    console.error("Error in fetching top 3 achievements:", err);
    res.status(500).json({
      success: false,
      data: null,
      message: "Error in fetching top 3 achievements",
      error: err.message,
    });
  }
};
function isFileTypeSupported(fileType, supportedTypes) {
  return supportedTypes.includes(fileType);
}
async function uploadFileToCloudinary(file, folder) {
  const options = { folder };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.createAchivments = async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role !== ADMIN_ROLE) {
      return res.status(403).json({
        success: false,
        message: "Permission denied. Only admins can create achievements.",
      });
    }

    const { title, description, instaPostLink, linkdinPostLink } = req.body;
    const file = req.files.imageUrl;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required.",
      });
    }

    const fileType = file.name.split(".")[1].toLowerCase();
    if (!isFileTypeSupported(fileType, SUPPORTED_FILE_TYPES)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    const response = await uploadFileToCloudinary(file, "CAC");
    if (!response || !response.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Error uploading image to Cloudinary",
      });
    }
    const achivementData = await achivemodel.create({
      title,
      description,
      instaPostLink,
      linkdinPostLink,
      imageUrl: response.secure_url,
    });

    res.status(201).json({
      success: true,
      data: achivementData,
      message: "Achievement created successfully.",
    });
  } catch (err) {
    console.error("Error in creating achievement:", err);
    res.status(500).json({
      success: false,
      data: null,
      message: "Error in creating achievement",
      error: err.message,
    });
  }
};
exports.updateAchivmentById = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Permission denied. Only admins can update achievements.",
      });
    }

    const { id } = req.params;
    const { title, description, instaPostLink, linkdinPostLink } = req.body;
    const file = req.files && req.files.imageUrl;
    let imageUrl;
    if (file) {
      const supportedTypes = ["jpg", "jpeg", "png"];
      const fileType = file.name.split(".")[1].toLowerCase();

      if (!isFileTypeSupported(fileType, supportedTypes)) {
        return res.status(400).json({
          success: false,
          message: "File format not supported",
        });
      }

      const response = await uploadFileToCloudinary(file, "CAC");
      imageUrl = response.secure_url;
    }
    const updatedAchievement = await achivemodel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        instaPostLink,
        linkdinPostLink,
        ...(imageUrl && { imageUrl }),
      },
      { new: true }
    );

    if (!updatedAchievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedAchievement,
      message: "Achievement updated successfully.",
    });
  } catch (err) {
    console.error("Error in updating achievement by ID:", err);
    res.status(500).json({
      success: false,
      data: null,
      message: "Error in updating achievement",
      error: err.message,
    });
  }
};

exports.deleteAchivment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid achievement ID",
      });
    }
    const deletedAchievement = await achivemodel.findByIdAndDelete(id);
    if (!deletedAchievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Achievement deleted successfully",
      data: deletedAchievement,
    });
  } catch (err) {
    console.error("Error in deleting achievement:", err);
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid achievement ID",
      });
    }
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Server error",
    });
  }
};
