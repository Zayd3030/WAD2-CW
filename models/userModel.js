const Datastore = require("nedb");
const db = new Datastore({ filename: "./data/users.db", autoload: true });

exports.getUserByUsername = (username, callback) => {
  db.findOne({ username: username }, callback);
};

exports.addUser = (user, callback) => {
  db.insert(user, callback);
};

exports.getAllUsers = (callback) => {
  db.find({}, callback);
};

exports.updateUserRole = (userId, role, callback) => {
  db.update({ _id: userId }, { $set: { role } }, {}, callback);
};

exports.deleteUser = (userId, callback) => {
  db.remove({ _id: userId }, {}, callback);
};
