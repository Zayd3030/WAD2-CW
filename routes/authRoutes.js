const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");

// Show login page
router.get("/login", (req, res) => {
  res.render("user/login", { message: req.session.message });
});

// Show register page
router.get("/register", (req, res) => {
  res.render("user/register", { message: req.session.message });
});

// Handle registration
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  userModel.addUser(username, password, "user", (err) => {
    if (err) {
      req.session.message = "Username already exists";
      return res.redirect("/register");
    }
    req.session.message = "Registration successful - Please log in.";
    res.redirect("/login");
  });
});

// Handle login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  userModel.authenticate(username, password, (err, user) => {
    if (err || !user) {
      req.session.message = "Invalid login details";
      return res.redirect("/login");
    }

    req.session.user = user;
    res.redirect("/courses");
  });
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;