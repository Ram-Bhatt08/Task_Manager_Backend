const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const {
  isProjectMember,
  isProjectAdmin,
} = require("../middleware/rbacMiddleware");

const {
  createProject,
  getProjects,
  getProjectById,
  addMember,
  removeMember,
  updateRole,
} = require("../controllers/projectController");

/* =========================
   PROJECT ROUTES (USER)
========================= */

// Get all projects (user logged in)
router.get("/", auth, getProjects);

// Get single project (member only)
router.get("/:id", auth, isProjectMember, getProjectById);

// Create project
router.post("/", auth, createProject);


/* =========================
   ADMIN ROUTES
========================= */

// Add member (admin only)
router.put("/:id/add-member", auth, isProjectAdmin, addMember);

// Remove member (admin only)
router.put("/:id/remove-member", auth, isProjectAdmin, removeMember);

// Update role (admin only)
router.put("/:id/update-role", auth, isProjectAdmin, updateRole);

module.exports = router;
