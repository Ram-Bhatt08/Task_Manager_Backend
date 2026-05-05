// routes/taskRoutes.js - Routes for task-related operations


const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const { isProjectMember } = require("../middleware/rbacMiddleware");

const {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
  getAllTasksForUser,
} = require("../controllers/taskController");

// ================= DASHBOARD =================
router.get("/all", auth, getAllTasksForUser);

// ================= PROJECT TASKS =================
router.post("/:projectId", auth, isProjectMember, createTask);
router.get("/:projectId", auth, isProjectMember, getTasks);

// ================= TASK ACTIONS =================
router.put("/:taskId/status", auth, updateTaskStatus);
router.delete("/:taskId", auth, deleteTask);

module.exports = router;