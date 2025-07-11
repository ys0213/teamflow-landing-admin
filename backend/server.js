import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import {
  signup,
  login,
  changePassword,
  deleteUser,
} from "./controllers/authController.js";

import {
  createTeam,
  getMyTeams,
  updateTeam,
  deleteTeam,
  inviteMember,
  createProject,
  getProjectsByTeam,
  updateProject,
  deleteProject,
} from "./controllers/teamController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ----- JWT ----- */
app.use((req, res, next) => {
  if (["/login", "/signup"].includes(req.path)) return next();

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  try {
    const token = auth.split(" ")[1];
    req.userId = jwt.verify(token, process.env.JWT_SECRET).userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
});

/* ----- DB ----- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ----- USER routes ----- */
app.post("/signup", signup);
app.post("/login", login);
app.put("/users/:id/password", changePassword);
app.delete("/users/:id", deleteUser);

/* ----- TEAM routes ----- */
app.post("/api/teams", createTeam);
app.get("/api/teams", getMyTeams);
app.put("/api/teams/:id", updateTeam);
app.delete("/api/teams/:id", deleteTeam);
app.post("/api/teams/:id/invite", inviteMember);

/* ----- PROJECT routes ----- */
app.post("/api/projects", createProject);
app.get("/api/projects/team/:teamId", getProjectsByTeam);
app.put("/api/projects/:id", updateProject);
app.delete("/api/projects/:id", deleteProject);

/* ----- SERVER ----- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server @ http://localhost:${PORT}`));
