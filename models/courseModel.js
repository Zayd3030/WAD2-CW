const Datastore = require("nedb");
const db = new Datastore({ filename: "courses.db", autoload: true });

exports.getAllCourses = (callback) => db.find({}, callback);
exports.addCourse = (course, callback) => db.insert(course, callback);
exports.getCourseById = (id, callback) => db.findOne({ _id: id }, callback);