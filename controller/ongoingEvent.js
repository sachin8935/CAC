const ongomodel = require("../models/ongoingEventModel");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

exports.getOngoingEvents = async (req, res) => {
  try {
    const response = await ongomodel.find({}).select("-dateCreated");
    res.status(200).json({
      success: true,
      data: response,
      message: "Ongoing events fetched successfully",
    });
  } catch (err) {
    console.error("Error in fetching ongoing events:", err);
    res.status(500).json({
      success: false,
      data: null,
      message: "Error in fetching ongoing events",
      error: err.message,
    });
  }
};

exports.getTop3OngoingEvents = async (req, res) => {
  try {
    const response = await ongomodel
      .find({})
      .sort({ dateCreated: -1 })
      .limit(3)
      .select("-dateCreated");

    res.status(200).json({
      success: true,
      data: response,
      message: "Top 3 ongoing events fetched successfully",
    });
  } catch (err) {
    console.error("Error in fetching top 3 ongoing events:", err);
    res.status(500).json({
      success: false,
      data: null,
      message: "Error in fetching top 3 ongoing events",
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
exports.createOngoingEvent = async (req, res) => {
  try {
    const { userId, role } = req.user;
    console.log(req.user);
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Permission denied. Only admins can create ongoing events.",
      });
    }
    const {
      title,
      description,
      eligibilityCriteria,
      linkEvent,
      registrationEnd,
    } = req.body;

    // Assuming you have multiple image files with the field name 'backgroundBanner'
    const files = req.files.backgroundBanner;

    // Validate file types
    const supportedTypes = ["jpg", "jpeg", "png"];
    for (const file of files) {
      const fileType = file.name.split(".")[1].toLowerCase();
      if (!isFileTypeSupported(fileType, supportedTypes)) {
        return res.status(400).json({
          success: false,
          message: `File format not supported for ${file.originalname}`,
        });
      }
    }

    // Upload all backgroundBanner files to Cloudinary
    const backgroundBannerUrls = await Promise.all(
      files.map(async (file) => {
        const response = await uploadFileToCloudinary(file, "CAC");
        return response.secure_url;
      })
    );

    // Ensure that at least one imageUrl is set (pick the first one from backgroundBanner)
    const imageUrl =
      backgroundBannerUrls.length > 0 ? backgroundBannerUrls[0] : null;

    const ongoingEventData = await ongomodel.create({
      title,
      description,
      eligibilityCriteria,
      linkEvent,
      registrationEnd,
      imageUrl: imageUrl, // Set imageUrl to the first one from backgroundBanner
      backgroundBanner: backgroundBannerUrls,
    });

    res.status(201).json({
      success: true,
      data: ongoingEventData,
      message: "Ongoing event created successfully.",
    });
  } catch (err) {
    console.error("Error in creating ongoing event:", err);
    res.status(500).json({
      success: false,
      data: null,
      message: "Error in creating ongoing event",
      error: err.message,
    });
  }
};

exports.deleteOngoingEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const deletedEvent = await ongomodel.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ongoing event deleted successfully",
      data: deletedEvent,
    });
  } catch (err) {
    console.error("Error in deleting ongoing event:", err);
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    res.status(500).json({
      success: false,
      error: err.message,
      message: "Server error",
    });
  }
};
exports.updateOngoingEventById = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Permission denied. Only admins can update ongoing events.",
      });
    }

    const { id } = req.params;
    const {
      title,
      description,
      eligibilityCriteria,
      linkEvent,
      registrationEnd,
    } = req.body;

    // Check if there are multiple files with the field name 'backgroundBanner'
    const files = req.files && req.files.backgroundBanner;

    // Validate file types
    if (files) {
      const supportedTypes = ["jpg", "jpeg", "png"];
      for (const file of files) {
        const fileType = file.name.split(".")[1].toLowerCase();
        if (!isFileTypeSupported(fileType, supportedTypes)) {
          return res.status(400).json({
            success: false,
            message: `File format not supported for ${file.originalname}`,
          });
        }
      }
    }

    // Upload all backgroundBanner files to Cloudinary
    const backgroundBannerUrls = files
      ? await Promise.all(
          files.map(async (file) => {
            const response = await uploadFileToCloudinary(file, "CAC");
            return response.secure_url;
          })
        )
      : undefined;

    // Update the event in MongoDB
    const updatedEvent = await ongomodel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        eligibilityCriteria,
        linkEvent,
        registrationEnd,
        ...(backgroundBannerUrls && { backgroundBanner: backgroundBannerUrls }),
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedEvent,
      message: "Ongoing event updated successfully.",
    });
  } catch (err) {
    console.error("Error in updating ongoing event by ID:", err);
    res.status(500).json({
      success: false,
      data: null,
      message: "Error in updating ongoing event",
      error: err.message,
    });
  }
};
