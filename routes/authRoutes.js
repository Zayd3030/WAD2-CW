// routes for authentication related actions such as login, register, and logout

const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

// Routes for get requests to show login and register pages
router.get("/login", controller.showLoginPage);
router.get("/register", controller.showRegisterPage);

// Routes for post requests to handle login and register actions
router.post("/login", controller.loginUser);
router.post("/register", controller.registerUser);

// Route for logout action
router.get("/logout", controller.logoutUser);

module.exports = router;
