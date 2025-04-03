const Datastore = require("nedb");
const db = new Datastore({ filename: "./data/bookings.db", autoload: true });

// Add a booking
exports.addBooking = (booking, callback) => {
  db.insert(booking, callback);
};

// Get bookings for a specific class
exports.getBookingsForClass = (classId, callback) => {
  db.find({ classId }, callback);
};

// Get bookings for a specific user
exports.getBookingsByUser = (userId, callback) => {
  db.find({ userId }, callback);
};

// Deletes a booking
exports.deleteBooking = (bookingId, callback) => {
  db.remove({ _id: bookingId }, {}, callback);
};