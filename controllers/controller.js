const courseModel = require("../models/courseModel");
const classModel = require("../models/classModel");
const bookingModel = require("../models/bookingModel");
const userModel = require("../models/userModel");

// Get all courses
exports.getAllCourses = (req, res) => {
  courseModel.getAllCourses((err, courses) => {
    if (err) return res.send("Error loading courses");
    res.render("courses", { courses, user: req.session.user });
  });
};

// Get single course with class list
exports.getCourseDetail = (req, res) => {
  courseModel.getCourseById(req.params.id, (err, course) => {
    if (!course) return res.send("Course not found");
    classModel.getClassesByCourse(req.params.id, (err, classes) => {
      const message = req.session.message;
      req.session.message = null;
      res.render("course", {
        course,
        classes,
        message,
        user: req.session.user
      });
    });
  });
};

// Book a class (prevent duplicates)
exports.bookClass = (req, res) => {
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
      username: req.session.user.username
    };

    bookingModel.addBooking(booking, () => {
      req.session.message = "Booking successful!";
      res.redirect("/courses/" + req.body.courseId);
    });
  });
};

// Get user's bookings
exports.getUserBookings = (req, res) => {
  bookingModel.getBookingsByUser(req.session.user._id, async (err, bookings) => {
    const message = req.session.message;
    req.session.message = null;

    if (!bookings || bookings.length === 0) {
      return res.render("user/myBookings", { bookings: [], message, user: req.session.user });
    }

    const detailedBookings = await Promise.all(
      bookings.map(b => new Promise(resolve => {
        classModel.getClassById(b.classId, (err, cls) => {
          if (!cls) return resolve(null);
          courseModel.getCourseById(cls.courseId, (err, course) => {
            resolve({
              ...b,
              class: cls,
              course: course
            });
          });
        });
      }))
    );

    res.render("user/myBookings", {
      bookings: detailedBookings.filter(b => b !== null),
      message,
      user: req.session.user
    });
  });
};
// Cancel a booking
exports.cancelBooking = (req, res) => {
  bookingModel.deleteBooking(req.params.bookingId, () => {
    req.session.message = "Booking cancelled successfully.";
    res.redirect("/courses/my-bookings");
  });
};

// Admin: View class bookings
exports.getClassBookings = (req, res) => {
  bookingModel.getBookingsForClass(req.params.classId, (err, bookings) => {
    res.render("admin/classBookings", { bookings });
  });
};

// Admin: Export bookings to PDF
exports.exportClassBookingsPDF = (req, res) => {
  const PDFDocument = require("pdfkit");
  bookingModel.getBookingsForClass(req.params.classId, (err, bookings) => {
    const doc = new PDFDocument();
    res.setHeader("Content-Disposition", "attachment; filename=class-bookings.pdf");
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);
    doc.fontSize(20).text("Class Booking List", { align: "center" });
    doc.moveDown();

    if (bookings.length === 0) {
      doc.text("No bookings found.");
    } else {
      bookings.forEach((b, i) => {
        doc.fontSize(12).text(`${i + 1}. ${b.username}`);
      });
    }

    doc.end();
  });
};

// Admin: View all users
exports.viewUsers = (req, res) => {
  userModel.getAllUsers((err, users) => {
    const enhanced = users.map(user => ({
      ...user,
      isOrganiser: user.role === "organiser"
    }));
    res.render("admin/manageUsers", { users: enhanced });
  });
};

// Admin: Promote user
exports.makeOrganiser = (req, res) => {
  userModel.updateUserRole(req.params.userId, "organiser", () => {
    res.redirect("/admin/manage-users");
  });
};

// Admin: Demote organiser
exports.removeOrganiser = (req, res) => {
  userModel.updateUserRole(req.params.userId, "user", () => {
    res.redirect("/admin/manage-users");
  });
};

// Admin: Delete user
exports.deleteUser = (req, res) => {
  userModel.deleteUser(req.params.userId, () => {
    res.redirect("/admin/manage-users");
  });
};
