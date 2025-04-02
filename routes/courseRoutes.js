const express = require("express");
const router = express.Router();
const courseModel = require("../models/courseModel");
const classModel = require("../models/classModel");
const bookingModel = require("../models/bookingModel");

router.get("/", (req, res) => {
  courseModel.getAllCourses((err, courses) => {
    res.render("courses", { courses });
  });
});

router.get("/:id", (req, res) => {
  const courseId = req.params.id;
  courseModel.getCourseById(courseId, (err, course) => {
    classModel.getClassesByCourse(courseId, (err, classes) => {
      res.render("course", { course, classes });
    });
  });
});

router.post("/book/:classId", (req, res) => {
  const classId = req.params.classId;
  const username = req.session.user.username;

  bookingModel.bookClass({ classId, username }, (err) => {
    res.redirect("/courses");
  });
});

module.exports = router;
