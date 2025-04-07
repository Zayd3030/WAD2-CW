const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

router.get("/login", controller.showLoginPage);
router.get("/register", controller.showRegisterPage);
router.post("/login", controller.loginUser);
router.post("/register", controller.registerUser);
router.get("/logout", controller.logoutUser);

module.exports = router;
