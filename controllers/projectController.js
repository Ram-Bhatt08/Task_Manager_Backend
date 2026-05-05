const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");

// ================= HELPER =================
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ================= CREATE PROJECT =================
exports.createProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Project name required" });
    }

    const project = await Project.create({
      name: name.trim(),
      admin: req.user,
      members: [{ user: req.user, role: "Admin" }],
    });

    const populated = await Project.findById(project._id)
      .populate("members.user", "email")
      .populate("admin", "email");

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create project failed" });
  }
};

// ================= GET ALL PROJECTS =================
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      "members.user": req.user,
    })
      .populate("members.user", "email")
      .populate("admin", "email");

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch projects failed" });
  }
};

// ================= GET PROJECT BY ID =================
exports.getProjectById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(req.params.id)
      .populate("members.user", "email")
      .populate("admin", "email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch failed" });
  }
};

// ================= ADD MEMBER =================
exports.addMember = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only admin allowed (extra safety)
    if (project.admin.toString() !== req.user) {
      return res.status(403).json({ message: "Admin only" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate
    const exists = project.members.some(
      (m) => m.user.toString() === user._id.toString()
    );

    if (exists) {
      return res.status(400).json({ message: "User already a member" });
    }

    project.members.push({
      user: user._id,
      role: "Member",
    });

    await project.save();

    const updated = await Project.findById(project._id)
      .populate("members.user", "email")
      .populate("admin", "email");

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Add member failed" });
  }
};

// ================= REMOVE MEMBER =================
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!isValidId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Admin check
    if (project.admin.toString() !== req.user) {
      return res.status(403).json({ message: "Admin only" });
    }

    // Prevent removing admin
    if (project.admin.toString() === userId) {
      return res.status(400).json({ message: "Cannot remove admin" });
    }

    const isMember = project.members.some(
      (m) => m.user.toString() === userId
    );

    if (!isMember) {
      return res.status(404).json({ message: "User not a member" });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== userId
    );

    await project.save();

    const updated = await Project.findById(project._id)
      .populate("members.user", "email")
      .populate("admin", "email");

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Remove failed" });
  }
};

// ================= UPDATE ROLE =================
exports.updateRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["Admin", "Member"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only admin
    if (project.admin.toString() !== req.user) {
      return res.status(403).json({ message: "Admin only" });
    }

    const member = project.members.find(
      (m) => m.user.toString() === userId
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.role = role;

    await project.save();

    const updated = await Project.findById(project._id)
      .populate("members.user", "email")
      .populate("admin", "email");

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Role update failed" });
  }
};
