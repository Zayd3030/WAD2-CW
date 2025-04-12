// Class model for the application to add, retrieve, update, and delete class records using uses NeDB

const Datastore = require("nedb");
const db = new Datastore({ filename: "classes.db", autoload: true });

// gets classes for a specific course

exports.getClassesByCourse = (courseId, callback) =>
  db.find({ courseId }, callback);


// adds a class to the database
exports.addClass = (classData, callback) => db.insert(classData, callback);

// retrieves all classes by id from the database
exports.getClassById = (id, callback) => db.findOne({ _id: id }, callback);

exports.getClassById = (id, callback) => db.findOne({ _id: id }, callback);

// updates a class in the database
exports.updateClass = (id, updatedData, callback) => {
  db.update({ _id: id }, { $set: updatedData }, {}, callback);
};

// deletes a class from the database
exports.deleteClass = (id, callback) => {
  db.remove({ _id: id }, {}, callback);
};
