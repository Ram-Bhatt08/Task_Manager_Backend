//controllers/dashboardController.js - Controller for handling dashboard-related operations (e.g., fetching user-specific data)

const Task = require("../models/Task");
const Project = require("../models/Project");

exports.getDashboard = async (req, res) => {
  try {
    // Step 1: get user projects
    const projects = await Project.find({
      "members.user": req.user,
    });

    const projectIds = projects.map((p) => p._id);

    // Step 2: get all tasks
    const tasks = await Task.find({
      project: { $in: projectIds },
    }).populate("assignedTo", "email name");

    const now = new Date();

    // =========================
    // STATUS COUNTS
    // =========================
    const statusCount = {
      todo: 0,
      inProgress: 0,
      done: 0,
    };

    // =========================
    // TASKS PER USER MAP
    // =========================
    const tasksPerUser = {};

    let overdueCount = 0;

    tasks.forEach((task) => {
      // status
      if (task.status === "To Do") statusCount.todo++;
      else if (task.status === "In Progress") statusCount.inProgress++;
      else if (task.status === "Done") statusCount.done++;

      // overdue
      if (task.dueDate && new Date(task.dueDate) < now && task.status !== "Done") {
        overdueCount++;
      }

      // per user
      const userId = task.assignedTo?._id?.toString();

      if (userId) {
        if (!tasksPerUser[userId]) {
          tasksPerUser[userId] = {
            name: task.assignedTo.name || "User",
            email: task.assignedTo.email,
            total: 0,
            todo: 0,
            inProgress: 0,
            done: 0,
          };
        }

        tasksPerUser[userId].total++;

        if (task.status === "To Do") tasksPerUser[userId].todo++;
        if (task.status === "In Progress") tasksPerUser[userId].inProgress++;
        if (task.status === "Done") tasksPerUser[userId].done++;
      }
    });

    res.json({
      totalTasks: tasks.length,
      statusCount,
      tasksPerUser: Object.values(tasksPerUser),
      overdueTasks: overdueCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};