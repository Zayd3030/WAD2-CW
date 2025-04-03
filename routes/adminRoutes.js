const express = require("express");
const router = express.Router();
const { checkOrganiser } = require("../auth/auth");
const courseModel = require("../models/courseModel");
const classModel = require("../models/classModel");
const bookingModel = require("../models/bookingModel");

// Admin Dashboard with courses and their classes
router.get("/", checkOrganiser, (req, res) => {
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
});

// Add New Course - Form
router.get("/add-course", checkOrganiser, (req, res) => {
  res.render("admin/addCourse");
});

// Add New Course - Submit
router.post("/add-course", checkOrganiser, (req, res) => {
  const { name, description, duration } = req.body;
  courseModel.addCourse({ name, description, duration }, () => {
    res.redirect("/admin");
  });
});

// Add Class to a Course - Form
router.get("/add-class/:courseId", checkOrganiser, (req, res) => {
  res.render("admin/addClass", { courseId: req.params.courseId });
});

// Add Class to a Course - Submit
router.post("/add-class/:courseId", checkOrganiser, (req, res) => {
  const { date, time, location, price } = req.body;
  const classData = {
    courseId: req.params.courseId,
    date,
    time,
    location,
    price
  };
  classModel.addClass(classData, () => {
    res.redirect("/admin");
  });
});

// View Bookings for a Class
router.get("/bookings/:classId", checkOrganiser, (req, res) => {
  bookingModel.getBookingsForClass(req.params.classId, (err, bookings) => {
    res.render("admin/classBookings", { bookings });
  });
});

const PDFDocument = require("pdfkit"); // add to top of file if not there

// Export bookings for a class as PDF
router.get("/bookings/:classId/export", checkOrganiser, (req, res) => {
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
      bookings.forEach((booking, index) => {
        doc.fontSize(12).text(`${index + 1}. ${booking.username}`);
      });
    }

    doc.end();
  });
});


// Edit Course Form
router.get("/edit-course/:id", checkOrganiser, (req, res) => {
  courseModel.getCourseById(req.params.id, (err, course) => {
    res.render("admin/editCourse", { course });
  });
});

// Update Course
router.post("/edit-course/:id", checkOrganiser, (req, res) => {
  const { name, description, duration } = req.body;
  courseModel.updateCourse(req.params.id, { name, description, duration }, () => {
    res.redirect("/admin");
  });
});

// Delete Course
router.post("/delete-course/:id", checkOrganiser, (req, res) => {
  courseModel.deleteCourse(req.params.id, () => {
    res.redirect("/admin");
  });
});

// Edit Class
router.get("/edit-class/:id", checkOrganiser, (req, res) => {
  classModel.getClassById(req.params.id, (err, classItem) => {
    res.render("admin/editClass", { classItem });
  });
});

// Update Class
router.post("/edit-class/:id", checkOrganiser, (req, res) => {
  const { date, time, location, price } = req.body;
  classModel.updateClass(req.params.id, { date, time, location, price }, () => {
    res.redirect("/admin");
  });
});

// Delete Class
router.post("/delete-class/:id", checkOrganiser, (req, res) => {
  classModel.deleteClass(req.params.id, () => {
    res.redirect("/admin");
  });
});

// Admin - remove user from booking
router.post("/remove-booking/:bookingId", checkOrganiser, (req, res) => {
  bookingModel.deleteBooking(req.params.bookingId, () => {
    res.redirect("back");
  });
});

const userModel = require("../models/userModel"); // make sure this is at the top

// View All Users & Organisers
router.get("/manage-users", checkOrganiser, (req, res) => {
  userModel.getAllUsers((err, users) => {
    if (err || !users) {
      return res.send("Error loading users");
    }

    // Define isOrganiser here — inside the callback
    const enhancedUsers = users.map(user => ({
      ...user,
      isOrganiser: user.role === "organiser"
    }));

    res.render("admin/manageUsers", { users: enhancedUsers });
  });
});


// Add Organiser
router.post("/make-organiser/:userId", checkOrganiser, (req, res) => {
  userModel.updateUserRole(req.params.userId, "organiser", () => {
    res.redirect("/admin/manage-users");
  });
});

// Remove Organiser (demote to user)
router.post("/remove-organiser/:userId", checkOrganiser, (req, res) => {
  userModel.updateUserRole(req.params.userId, "user", () => {
    res.redirect("/admin/manage-users");
  });
});

// Delete User
router.post("/delete-user/:userId", checkOrganiser, (req, res) => {
  userModel.deleteUser(req.params.userId, () => {
    res.redirect("/admin/manage-users");
  });
});

module.exports = router;
