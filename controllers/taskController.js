// controllers/taskController for handling task-related operations



const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/Project");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// =========================
// GET ALL TASKS (DASHBOARD)
// =========================
exports.getAllTasksForUser = async (req, res) => {
  try {
    const projects = await Project.find({
      "members.user": req.user,
    });

    const projectIds = projects.map((p) => p._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
    })
      .populate("assignedTo", "email")
      .populate("project", "name");

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch all tasks failed" });
  }
};

// =========================
// GET TASKS BY PROJECT
// =========================
exports.getTasks = async (req, res) => {
  try {
    if (!isValidId(req.params.projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const tasks = await Task.find({
      project: req.params.projectId,
    })
      .populate("assignedTo", "email")
      .populate("project", "name");

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch failed" });
  }
};

// =========================
// CREATE TASK (ADMIN ONLY)
// =========================
exports.createTask = async (req, res) => {
  try {
    const { title, assignedTo } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title required" });
    }

    if (!isValidId(req.params.projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin.toString() !== req.user) {
      return res.status(403).json({ message: "Admin only" });
    }

    // validate assigned user is member
    if (assignedTo) {
      const isMember = project.members.some(
        (m) => m.user.toString() === assignedTo
      );

      if (!isMember) {
        return res.status(400).json({ message: "User not in project" });
      }
    }

    await Task.create({
      ...req.body,
      project: req.params.projectId,
      createdBy: req.user,
    });

    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "email")
      .populate("project", "name");

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create failed" });
  }
};

// =========================
// UPDATE TASK STATUS
// =========================
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["To Do", "In Progress", "Done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (!isValidId(req.params.taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(req.params.taskId).populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = task.project;

    const isMember =
      project.admin.toString() === req.user ||
      project.members.some((m) => m.user.toString() === req.user);

    if (!isMember) {
      return res.status(403).json({ message: "Not allowed" });
    }

    task.status = status;
    await task.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// =========================
// DELETE TASK (ADMIN ONLY)
// =========================
exports.deleteTask = async (req, res) => {
  try {
    if (!isValidId(req.params.taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(req.params.taskId).populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = task.project;

    if (project.admin.toString() !== req.user) {
      return res.status(403).json({ message: "Admin only" });
    }

    await task.deleteOne();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

