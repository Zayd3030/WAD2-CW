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

// Booking confirmation page
router.get("/confirmation", checkAuthenticated, (req, res) => {
  res.render("user/confirmation");
});

// My Bookings with full class + course info and message
router.get("/my-bookings", checkAuthenticated, async (req, res) => {
  bookingModel.getBookingsByUser(req.session.user._id, async (err, bookings) => {
    const message = req.session.message;
    req.session.message = null;

    if (!bookings || bookings.length === 0) {
      return res.render("user/myBookings", { bookings: [], message });
    }

    const enhancedBookings = await Promise.all(
      bookings.map(async (booking) => {
        return new Promise((resolve) => {
          classModel.getClassById(booking.classId, (err, classData) => {
            if (!classData) return resolve(null);

            courseModel.getCourseById(classData.courseId, (err, courseData) => {
              resolve({
                ...booking,
                class: classData,
                course: courseData,
              });
            });
          });
        });
      })
    );

    const filtered = enhancedBookings.filter(b => b !== null);
    res.render("user/myBookings", { bookings: filtered, message });
  });
});

// Book a class with duplicate prevention
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

// Cancel Booking
router.post("/cancel-booking/:bookingId", checkAuthenticated, (req, res) => {
  bookingModel.deleteBooking(req.params.bookingId, () => {
    req.session.message = "Booking cancelled successfully.";
    res.redirect("/courses/my-bookings");
  });
});

// View single course and its classes
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
