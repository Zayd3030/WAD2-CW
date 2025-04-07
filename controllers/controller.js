const courseModel = require("../models/courseModel");
const classModel = require("../models/classModel");
const bookingModel = require("../models/bookingModel");
const userModel = require("../models/userModel");

// Public: Show all courses
exports.getAllCourses = (req, res) => {
  courseModel.getAllCourses((err, courses) => {
    if (err) return res.send("Error loading courses");
    res.render("courses", { courses, user: req.session.user });
  });
};

// Public: View a single course with its classes
exports.getCourseDetail = (req, res) => {
  courseModel.getCourseById(req.params.id, (err, course) => {
    if (!course) return res.send("Course not found");
    classModel.getClassesByCourse(req.params.id, (err, classes) => {
      const message = req.session.message;
      req.session.message = null;
      res.render("course", { course, classes, message });
    });
  });
};

// Book a class (with duplicate prevention)
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
      username: req.session.user.username,
    };

    bookingModel.addBooking(booking, () => {
      res.redirect("/courses/confirmation");
    });
  });
};

// Booking confirmation
exports.showConfirmation = (req, res) => {
  res.render("user/confirmation");
};

// User: View my bookings
exports.getUserBookings = async (req, res) => {
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
};

// Cancel booking
exports.cancelBooking = (req, res) => {
  bookingModel.deleteBooking(req.params.bookingId, () => {
    req.session.message = "Booking cancelled successfully.";
    res.redirect("/courses/my-bookings");
  });
};

// Admin: View bookings for a class
exports.getClassBookings = (req, res) => {
  bookingModel.getBookingsForClass(req.params.classId, (err, bookings) => {
    res.render("admin/classBookings", { bookings });
  });
};

// Admin: Export class bookings to PDF
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
      bookings.forEach((booking, index) => {
        doc.fontSize(12).text(`${index + 1}. ${booking.username}`);
      });
    }

    doc.end();
  });
};

// Admin: View all users
exports.viewUsers = (req, res) => {
  userModel.getAllUsers((err, users) => {
    const enhancedUsers = users.map(user => ({
      ...user,
      isOrganiser: user.role === "organiser"
    }));
    res.render("admin/manageUsers", { users: enhancedUsers });
  });
};

// Admin: Promote to organiser
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
