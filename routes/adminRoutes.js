const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const { checkOrganiser } = require("../auth/auth");

// Dashboard
router.get("/", checkOrganiser, controller.adminDashboard);

// Courses
router.get("/add-course", checkOrganiser, controller.showAddCourseForm);
router.post("/add-course", checkOrganiser, controller.addCourse);
router.get("/edit-course/:id", checkOrganiser, controller.showEditCourse);
router.post("/edit-course/:id", checkOrganiser, controller.updateCourse);
router.post("/delete-course/:id", checkOrganiser, controller.deleteCourse);

// Classes
router.get("/add-class/:courseId", checkOrganiser, controller.showAddClassForm);
router.post("/add-class/:courseId", checkOrganiser, controller.addClass);
router.get("/edit-class/:id", checkOrganiser, controller.showEditClass);
router.post("/edit-class/:id", checkOrganiser, controller.updateClass);
router.post("/delete-class/:id", checkOrganiser, controller.deleteClass);

// Bookings
router.get("/bookings/:classId", checkOrganiser, controller.viewClassBookings);
router.get("/bookings/:classId/export", checkOrganiser, controller.exportBookingsPDF);
router.post("/remove-booking/:bookingId", checkOrganiser, controller.removeUserFromBooking);

// User Management
router.get("/manage-users", checkOrganiser, controller.manageUsers);
router.post("/make-organiser/:userId", checkOrganiser, controller.makeOrganiser);
router.post("/remove-organiser/:userId", checkOrganiser, controller.removeOrganiser);
router.post("/delete-user/:userId", checkOrganiser, controller.deleteUser);

module.exports = router;
