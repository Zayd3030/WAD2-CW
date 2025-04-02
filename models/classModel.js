const Datastore = require("nedb");
const db = new Datastore({ filename: "classes.db", autoload: true });

exports.getClassesByCourse = (courseId, callback) =>
  db.find({ courseId }, callback);

exports.addClass = (classData, callback) => db.insert(classData, callback);
exports.getClassById = (id, callback) => db.findOne({ _id: id }, callback);
