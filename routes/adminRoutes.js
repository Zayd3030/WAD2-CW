const express = require("express");
const router = express.Router();
const { checkOrganiser } = require("../auth/auth");
const controller = require("../controllers/controller");

router.get("/", checkOrganiser, (req, res) => {
    res.render("admin/dashboard", { user: req.session.user });
  });

router.get("/bookings/:classId", checkOrganiser, controller.getClassBookings);
router.get("/bookings/:classId/export", checkOrganiser, controller.exportClassBookingsPDF);

router.get("/manage-users", checkOrganiser, controller.viewUsers);
router.post("/make-organiser/:userId", checkOrganiser, controller.makeOrganiser);
router.post("/remove-organiser/:userId", checkOrganiser, controller.removeOrganiser);
router.post("/delete-user/:userId", checkOrganiser, controller.deleteUser);

module.exports = router;