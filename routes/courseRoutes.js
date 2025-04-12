// Routes for course related operations, including booking and viewing courses.

const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const { checkAuthenticated } = require("../auth/auth");

// View all courses
router.get("/", controller.getAllCourses);

// Authenticated user routes for booking classes
router.get("/confirmation", checkAuthenticated, controller.confirmationPage);
router.get("/my-bookings", checkAuthenticated, controller.myBookings);
router.post("/book/:classId", checkAuthenticated, controller.bookClass);
router.post("/cancel-booking/:bookingId", checkAuthenticated, controller.cancelBooking);

// Guest booking routes
router.get("/guest-book/:classId", controller.guestBookingForm);
router.post("/guest-book/:classId", controller.submitGuestBooking);

// Public route: View course details (with conditional content)
router.get("/:id", controller.getCourseDetails);

module.exports = router;
