const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");
const classModel = require("../models/classModel");
const bookingModel = require("../models/bookingModel");
const PDFDocument = require("pdfkit");

// ---------------------- AUTH ----------------------

exports.showLoginPage = (req, res) => {
  const message = req.session?.message || null;
  req.session.message = null;
  res.render("user/login", { message });
};

exports.showRegisterPage = (req, res) => {
  const message = req.session?.message || null;
  req.session.message = null;
  res.render("user/register", { message });
};

exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  userModel.authenticate(username, password, (err, user) => {
    if (err || !user) {
      req.session.message = "Invalid login details";
      return res.redirect("/login");
    }
    req.session.user = user;
    res.redirect("/courses");
  });
};

exports.registerUser = (req, res) => {
  const { username, password } = req.body;

  userModel.addUser(username, password, "user", (err) => {
    if (err) {
      req.session.message = "Username already exists";
      return res.redirect("/register");
    }
    req.session.message = "Registration successful - Please log in.";
    res.redirect("/login");
  });
};

exports.logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

// ---------------------- COURSES ----------------------

exports.getAllCourses = (req, res) => {
  courseModel.getAllCourses((err, courses) => {
    if (err) return res.send("Error loading courses");
    res.render("courses", { courses });
  });
};

exports.getCourseDetails = (req, res) => {
  courseModel.getCourseById(req.params.id, (err, course) => {
    if (err || !course) return res.send("Course not found");

    classModel.getClassesByCourse(req.params.id, (err, classes) => {
      const message = req.session.message;
      req.session.message = null;
      res.render("course", { course, classes, message });
    });
  });
};

exports.confirmationPage = (req, res) => {
  res.render("user/confirmation");
};

exports.myBookings = (req, res) => {
  bookingModel.getBookingsByUser(req.session.user._id, async (err, bookings) => {
    const message = req.session.message;
    req.session.message = null;

    if (!bookings || bookings.length === 0) {
      return res.render("user/myBookings", { bookings: [], message });
    }

    const detailed = await Promise.all(
      bookings.map((booking) => {
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

    const filtered = detailed.filter(b => b !== null);
    res.render("user/myBookings", { bookings: filtered, message });
  });
};

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

exports.cancelBooking = (req, res) => {
  bookingModel.deleteBooking(req.params.bookingId, () => {
    req.session.message = "Booking cancelled successfully.";
    res.redirect("/courses/my-bookings");
  });
};

// ---------------------- ADMIN ----------------------

exports.adminDashboard = (req, res) => {
  courseModel.getAllCourses((err, courses) => {
    if (err || !courses) return res.render("admin/dashboard", { courses: [] });

    let pending = courses.length;
    if (pending === 0) return res.render("admin/dashboard", { courses: [] });

    courses.forEach((course, i) => {
      classModel.getClassesByCourse(course._id, (err, classes) => {
        courses[i].classes = classes;
        pending--;
        if (pending === 0) {
          res.render("admin/dashboard", { courses });
        }
      });
    });
  });
};

exports.showAddCourseForm = (req, res) => {
  res.render("admin/addCourse");
};

exports.addCourse = (req, res) => {
  const { name, description, duration } = req.body;
  courseModel.addCourse({ name, description, duration }, () => {
    res.redirect("/admin");
  });
};

exports.showAddClassForm = (req, res) => {
  res.render("admin/addClass", { courseId: req.params.courseId });
};

exports.addClass = (req, res) => {
  const { date, time, location, price } = req.body;
  const classData = {
    courseId: req.params.courseId,
    date,
    time,
    location,
    price,
  };
  classModel.addClass(classData, () => {
    res.redirect("/admin");
  });
};

exports.viewClassBookings = (req, res) => {
  bookingModel.getBookingsForClass(req.params.classId, (err, bookings) => {
    res.render("admin/classBookings", { bookings });
  });
};

exports.exportBookingsPDF = (req, res) => {
  bookingModel.getBookingsForClass(req.params.classId, (err, bookings) => {
    if (err) return res.send("Error generating PDF");

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

exports.showEditCourse = (req, res) => {
  courseModel.getCourseById(req.params.id, (err, course) => {
    res.render("admin/editCourse", { course });
  });
};

exports.updateCourse = (req, res) => {
  const { name, description, duration } = req.body;
  courseModel.updateCourse(req.params.id, { name, description, duration }, () => {
    res.redirect("/admin");
  });
};

exports.deleteCourse = (req, res) => {
  courseModel.deleteCourse(req.params.id, () => {
    res.redirect("/admin");
  });
};

exports.showEditClass = (req, res) => {
  classModel.getClassById(req.params.id, (err, classItem) => {
    res.render("admin/editClass", { classItem });
  });
};

exports.updateClass = (req, res) => {
  const { date, time, location, price } = req.body;
  classModel.updateClass(req.params.id, { date, time, location, price }, () => {
    res.redirect("/admin");
  });
};

exports.deleteClass = (req, res) => {
  classModel.deleteClass(req.params.id, () => {
    res.redirect("/admin");
  });
};

exports.removeUserFromBooking = (req, res) => {
  bookingModel.deleteBooking(req.params.bookingId, () => {
    res.redirect("back");
  });
};

exports.manageUsers = (req, res) => {
  userModel.getAllUsers((err, users) => {
    if (err || !users) return res.send("Error loading users");

    const enhancedUsers = users.map(u => ({
      ...u,
      isOrganiser: u.role === "organiser"
    }));

    res.render("admin/manageUsers", { users: enhancedUsers });
  });
};

exports.makeOrganiser = (req, res) => {
  userModel.updateUserRole(req.params.userId, "organiser", () => {
    res.redirect("/admin/manage-users");
  });
};

exports.removeOrganiser = (req, res) => {
  userModel.updateUserRole(req.params.userId, "user", () => {
    res.redirect("/admin/manage-users");
  });
};

exports.deleteUser = (req, res) => {
  userModel.deleteUser(req.params.userId, () => {
    res.redirect("/admin/manage-users");
  });
};

// ---------------------- GUEST BOOKINGS ----------------------

exports.guestBookingForm = (req, res) => {
  const classId = req.params.classId;

  classModel.getClassById(classId, (err, classData) => {
    if (err || !classData) return res.send("Class not found");

    courseModel.getCourseById(classData.courseId, (err, course) => {
      if (err || !course) return res.send("Course not found");

      const message = req.session.message;
      req.session.message = null;

      res.render("guest/guestBooking", {
        classData,
        course,
        message
      });
    });
  });
};

exports.submitGuestBooking = (req, res) => {
  const classId = req.params.classId;
  const { name, email } = req.body;

  if (!name || !email) {
    req.session.message = "Please enter both your name and email to book.";
    return res.redirect(`/guest/guestBooking/${classId}`);
  }

  const booking = {
    classId,
    userId: "guest",
    username: `${name} (${email})`
  };

  bookingModel.addBooking(booking, () => {
    res.redirect("/guest/guestConfirmation");
  });
};

exports.guestConfirmationPage = (req, res) => {
  res.render("guest/guestConfirmation");
};