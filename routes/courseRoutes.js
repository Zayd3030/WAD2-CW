const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../auth/auth");

const courseModel = require("../models/courseModel");
const classModel = require("../models/classModel");
const bookingModel = require("../models/bookingModel");

// View all courses
router.get("/", (req, res) => {
  courseModel.getAllCourses((err, courses) => {
    if (err) return res.send("Error loading courses");
    res.render("courses", { courses });
  });
});

// ✅ Booking confirmation page
router.get("/confirmation", checkAuthenticated, (req, res) => {
  res.render("user/confirmation");
});

// ✅ View user's booking history
router.get("/my-bookings", checkAuthenticated, (req, res) => {
  bookingModel.getBookingsByUser(req.session.user._id, (err, bookings) => {
    if (!bookings || bookings.length === 0) {
      return res.render("user/myBookings", { bookings: [] });
    }

    res.render("user/myBookings", { bookings });
  });
});

// ✅ Book a class (with duplicate prevention)
router.post("/book/:classId", checkAuthenticated, (req, res) => {
  const userId = req.session.user._id;
  const classId = req.params.classId;

  bookingModel.getBookingsForClass(classId, (err, bookings) => {
    const alreadyBooked = bookings.some(b => b.userId === userId);

    if (alreadyBooked) {
      req.session.message = "You have already booked this class.";
      return res.redirect("/courses/" + req.body.courseId);
    }

    const booking = {
      classId,
      userId,
      username: req.session.user.username,
    };

    bookingModel.addBooking(booking, () => {
      res.redirect("/courses/confirmation");
    });
  });
});

// ✅ View specific course and its classes
router.get("/:id", checkAuthenticated, (req, res) => {
  courseModel.getCourseById(req.params.id, (err, course) => {
    if (err || !course) return res.send("Course not found");

    classModel.getClassesByCourse(req.params.id, (err, classes) => {
      const message = req.session.message;
      req.session.message = null;

      res.render("course", { course, classes, message });
    });
  });
});

module.exports = router;
