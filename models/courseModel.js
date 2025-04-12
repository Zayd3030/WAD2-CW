// Course model for the application using NeDB as the database to store, add, update and delete course information.

const Datastore = require("nedb");
const db = new Datastore({ filename: "courses.db", autoload: true });

// Retrieves all courses from the database
exports.getAllCourses = (callback) => db.find({}, callback);

// adds a course to the database
exports.addCourse = (course, callback) => db.insert(course, callback);

// retrieves a course by id from the database
exports.getCourseById = (id, callback) => db.findOne({ _id: id }, callback);

// updates a course in the database
exports.updateCourse = (id, updatedData, callback) => {
    db.update({ _id: id }, { $set: updatedData }, {}, callback);
  };
  
  // deletes a course from the database
  exports.deleteCourse = (id, callback) => {
    db.remove({ _id: id }, {}, callback);
  };
  