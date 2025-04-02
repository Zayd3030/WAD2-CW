const Datastore = require("nedb");
const db = new Datastore({ filename: "bookings.db", autoload: true });

exports.bookClass = (booking, callback) => db.insert(booking, callback);

exports.getBookingsForUser = (username, callback) =>
  db.find({ username }, callback);

exports.getBookingsForClass = (classId, callback) =>
  db.find({ classId }, callback);
