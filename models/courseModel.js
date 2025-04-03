const Datastore = require("nedb");
const db = new Datastore({ filename: "courses.db", autoload: true });

exports.getAllCourses = (callback) => db.find({}, callback);
exports.addCourse = (course, callback) => db.insert(course, callback);
exports.getCourseById = (id, callback) => db.findOne({ _id: id }, callback);

exports.updateCourse = (id, updatedData, callback) => {
    db.update({ _id: id }, { $set: updatedData }, {}, callback);
  };
  
  exports.deleteCourse = (id, callback) => {
    db.remove({ _id: id }, {}, callback);
  };
  