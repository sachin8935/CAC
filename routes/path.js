const express = require("express");
const router = express.Router();
const {
  getAchivments,
  getTop3Achivments,
  createAchivments,
  updateAchivmentById,
  deleteAchivment,
} = require("../controller/achivments");
const {
  getOngoingEvents,
  getTop3OngoingEvents,
  createOngoingEvent,
  updateOngoingEventById,
  deleteOngoingEvent,
} = require("../controller/ongoingEvent");
// const { signup } = require("../controller/adminAuth");
const { login } = require("../controller/adminAuth");
const { requireAuth } = require("../middleware/authUser");
router.get("/getAchivments/all", getAchivments);
router.get("/getAchivments", getTop3Achivments);
router.get("/getOngoingEvents/all", getOngoingEvents);
router.get("/getOngoingEvents", getTop3OngoingEvents);
// router.post("/signup", signup);
router.get("/login", login);
router.get("/admin", requireAuth, (req, res) => {
  res.send("admin Page");
});
router.post("/admin/createEvent", (req, res, next) => {
  requireAuth(req, res, (err) => {
    if (err) {
      console.error("Authentication failed:", err);
      res.status(401).json({
        success: false,
        message: "Unauthorized. Authentication failed.",
      });
    } else {
      createOngoingEvent(req, res, next);
    }
  });
});
router.put("/admin/updateEvent/:id", (req, res, next) => {
  requireAuth(req, res, (err) => {
    if (err) {
      console.error("Authentication failed:", err);
      res.status(401).json({
        success: false,
        message: "Unauthorized. Authentication failed.",
      });
    } else {
      updateOngoingEventById(req, res, next);
    }
  });
});
router.delete("/admin/deleteEvent/:id", (req, res, next) => {
  requireAuth(req, res, (err) => {
    if (err) {
      console.error("Authentication failed:", err);
      res.status(401).json({
        success: false,
        message: "Unauthorized. Authentication failed.",
      });
    } else {
      deleteOngoingEvent(req, res, next);
    }
  });
});
router.post("/admin/createAchivment", (req, res, next) => {
  requireAuth(req, res, (err) => {
    if (err) {
      console.error("Authentication failed:", err);
      res.status(401).json({
        success: false,
        message: "Unauthorized. Authentication failed.",
      });
    } else {
      createAchivments(req, res, next);
    }
  });
});
router.put("/admin/updateAchivment/:id", (req, res, next) => {
  requireAuth(req, res, (err) => {
    if (err) {
      console.error("Authentication failed:", err);
      res.status(401).json({
        success: false,
        message: "Unauthorized. Authentication failed.",
      });
    } else {
      updateAchivmentById(req, res, next);
    }
  });
});
router.delete("/admin/deleteAchivment/:id", (req, res, next) => {
  requireAuth(req, res, (err) => {
    if (err) {
      console.error("Authentication failed:", err);
      res.status(401).json({
        success: false,
        message: "Unauthorized. Authentication failed.",
      });
    } else {
      deleteAchivment(req, res, next);
    }
  });
});
module.exports = router;
