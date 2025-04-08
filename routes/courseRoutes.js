const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const { checkAuthenticated } = require("../auth/auth");

router.get("/", controller.getAllCourses);
router.get("/confirmation", checkAuthenticated, controller.confirmationPage);
router.get("/my-bookings", checkAuthenticated, controller.myBookings);
router.post("/book/:classId", checkAuthenticated, controller.bookClass);
router.post("/cancel-booking/:bookingId", checkAuthenticated, controller.cancelBooking);
router.get("/:id", checkAuthenticated, controller.getCourseDetails);

module.exports = router;
