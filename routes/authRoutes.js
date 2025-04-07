const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

// GET: Login page
router.get("/login", (req, res) => {
  res.render("user/login", { message: req.session.message });
});

// POST: Login user
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  userModel.getUserByUsername(username, (err, user) => {
    if (err || !user) {
      req.session.message = "Invalid username or password.";
      return res.redirect("/login");
    }

    bcrypt.compare(password, user.password, (err, match) => {
      if (match) {
        req.session.user = {
          _id: user._id,
          username: user.username,
          role: user.role,
          isOrganiser: user.role === "organiser"
        };
        res.redirect("/courses");
      } else {
        req.session.message = "Invalid username or password.";
        res.redirect("/login");
      }
    });
  });
});

// GET: Register page
router.get("/register", (req, res) => {
  res.render("user/register", { message: req.session.message });
});

// POST: Register new user
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  userModel.getUserByUsername(username, (err, existingUser) => {
    if (existingUser) {
      req.session.message = "Username already exists.";
      return res.redirect("/register");
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        req.session.message = "Error creating account.";
        return res.redirect("/register");
      }

      const newUser = {
        username,
        password: hash,
        role: "user"
      };

      userModel.addUser(newUser, () => {
        req.session.message = "Registration successful. Please login.";
        res.redirect("/login");
      });
    });
  });
});

// GET: Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
