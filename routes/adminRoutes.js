const express = require("express");
const router = express.Router();
const { checkOrganiser } = require("../auth/auth");
const courseModel = require("../models/courseModel");
const classModel = require("../models/classModel");
const bookingModel = require("../models/bookingModel");

// Admin Dashboard
router.get("/", checkOrganiser, (req, res) => {
  res.render("admin/dashboard");
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

module.exports = router;
