const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../auth/auth");
const controller = require("../controllers/controller");

// Public course pages
router.get("/", controller.getAllCourses);
router.get("/:id", checkAuthenticated, controller.getCourseDetail);

// Bookings
router.post("/book/:classId", checkAuthenticated, controller.bookClass);
router.get("/my-bookings", checkAuthenticated, controller.getUserBookings);
router.post("/cancel-booking/:bookingId", checkAuthenticated, controller.cancelBooking);

module.exports = router;
