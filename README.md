 # 📌 Team Task Management System (MERN Stack)

A full-stack Team Task Management Web Application built using the MERN stack.
This application allows users to create projects, assign tasks, collaborate with team members, and track progress using a clean dashboard and Kanban-style board.

# 🚀 Features <br>
# 🔐 Authentication <br>
. User Signup & Login <br>
. JWT-based authentication <br>
. Protected routes <br>

# 📊 Dashboard <br>
Overview of total tasks <br>
Task status breakdown (To Do, In Progress, Done) <br>
Overdue task tracking <br>
Personalized “My Tasks” section <br>

# 📁 Project Management <br>
Create projects <br>
Add team members via email <br>
Role-based access (Admin / Member) <br>
View project details <br>

# ✅ Task Management <br>
Create tasks (Admin only) <br>
Assign tasks to members <br>
Set priority (Low / Medium / High) <br>
Set due dates <br>
Update task status <br>
Delete tasks <br>

# 📌 Kanban Board <br>
Tasks organized into: <br>
To Do <br>
In Progress <br>
Done <br>

# 🛠️ Tech Stack <br>
# Frontend <br>
React.js <br>
React Router DOM <br>
Axios <br>
CSS (Custom Styled UI) <br>

# Backend <br>
Node.js <br>
Express.js <br>

# Database <br>
MongoDB (Mongoose) <br>
Authentication <br>
JSON Web Tokens (JWT) <br>

# File Structure <br>

backend/ <br>
│  <br>
├── config/  <br>
│   └── db.js                # MongoDB connection setup  <br>
│  <br>
├── controllers/  <br>
│   ├── authController.js   # Login & Signup logic  <br>
│   ├── projectController.js  <br>
│   ├── taskController.js  <br>
│   └── dashboardController.js  <br>
│  <br>
├── middleware/  <br>
│   └── authMiddleware.js   # JWT verification  <br>
│
├── models/  <br>
│   ├── User.js  <br>
│   ├── Project.js  <br>
│   └── Task.js  <br>
│  <br>
├── routes/  <br>
│   ├── authRoutes.js  <br>
│   ├── projectRoutes.js  <br>
│   ├── taskRoutes.js  <br>
│   └── dashboardRoutes.js  <br>
│  <br>
├── .env                   # Environment variables  <br>
├── server.js              # Entry point  <br>
└── package.json  <br>

# 🔄 Application Flow
1. User logs in / signs up
2. Redirected to Dashboard
3. User creates or joins projects
4. Admin can:
Add members
Create tasks
5. Tasks are:
Assigned to members
Managed via Kanban board
6. Users track progress in Dashboard

# ⚙️ Installation & Setup <br>
1️⃣ Clone the repository <br>
git clone https://github.com/Ram-Bhatt08/task_manager_backend.git <br>
cd team-task-manager <br>

2️⃣ Install dependencies <br>
Frontend <br>
cd frontend <br>
npm install <br>

Backend <br>
cd backend <br>
npm install <br>

3️⃣ Setup Environment Variables <br>

Create a .env file in backend: <br>
PORT=5000  <br>
MONGO_URI=your_mongodb_connection <br>
JWT_SECRET=your_secret_key <br>

4️⃣ Run the project
  
start backend <br>
node server.js <br>

start frontend <br>
npm run dev <br>

# 👨‍💻 Author <br>

 <b>Ram Bhatt </b> <br>
 <I>Software Developer </I> <br>
<I> Problem Solver </I> <br>
































