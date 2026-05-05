// middleware/rbacMiddleware.js - middleware for checking user permissions on projects


const Project = require("../models/Project");
const mongoose = require("mongoose");

const getProjectId = (req) => req.params.projectId || req.params.id;

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ================= MEMBER CHECK =================
exports.isProjectMember = async (req, res, next) => {
  try {
    const projectId = getProjectId(req);

    if (!projectId || !isValidId(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId);

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    const isMember =
      project.admin.toString() === req.user ||
      project.members.some((m) => m.user.toString() === req.user);

    if (!isMember)
      return res.status(403).json({ message: "Access denied" });

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "RBAC error" });
  }
};

// ================= ADMIN CHECK =================
exports.isProjectAdmin = async (req, res, next) => {
  try {
    const projectId = getProjectId(req);

    if (!projectId || !isValidId(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId);

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    if (project.admin.toString() !== req.user)
      return res.status(403).json({ message: "Admin only" });

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "RBAC error" });
  }
};
