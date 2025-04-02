const Datastore = require("nedb");
const bcrypt = require("bcrypt");
const db = new Datastore({ filename: "users.db", autoload: true });

// Add new user
exports.addUser = (username, password, role, callback) => {
  db.findOne({ username }, (err, user) => {
    if (user) return callback(new Error("User exists"));

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      db.insert({ username, password: hashedPassword, role }, callback);
    });
  });
};

// Authenticate user
exports.authenticate = (username, password, callback) => {
  db.findOne({ username }, (err, user) => {
    if (!user) return callback(null, false);

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) callback(null, user);
      else callback(null, false);
    });
  });
};

