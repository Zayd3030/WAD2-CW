const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

// Show guest booking form
router.get("/guestBooking/:classId", controller.guestBookingForm);

// Submit guest booking
router.post("/guestBooking/:classId", controller.submitGuestBooking);

// Confirmation page
router.get("/guestConfirmation", (req, res) => {
  res.render("guest/guestConfirmation");
});

module.exports = router;
