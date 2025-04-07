const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../auth/auth");
const controller = require("../controllers/controller");

router.get("/", controller.getAllCourses);
router.get("/:id", controller.getCourseDetail);

router.post("/book/:classId", checkAuthenticated, controller.bookClass);
router.get("/confirmation", checkAuthenticated, controller.showConfirmation);
router.get("/my-bookings", checkAuthenticated, controller.getUserBookings);
router.post("/cancel-booking/:bookingId", checkAuthenticated, controller.cancelBooking);

module.exports = router;