//routes/dashboardRoutes.js - Routes for dashboard-related operations (e.g., fetching user-specific data)

const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/dashboardController");

router.get("/dashboard", auth, getDashboard);

module.exports = router;
