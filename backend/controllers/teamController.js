import Team from "../models/Team.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

/* ---------- TEAM CRUD ---------- */
export const createTeam = async (req, res) => {
  try {
    const team = await Team.create({
      name: req.body.name,
      owner: req.userId,
      members: [req.userId],
    });
    res.status(201).json(team);
  } catch {
    res.status(500).json({ message: "Create team failed" });
  }
};

export const getMyTeams = async (req, res) => {
  const teams = await Team.find({ members: req.userId });
  res.json(teams);
};

export const updateTeam = async (req, res) => {
  const team = await Team.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    { $set: req.body },
    { new: true }
  );
  if (!team) return res.status(404).json({ message: "Team not found" });
  res.json(team);
};

export const deleteTeam = async (req, res) => {
  await Team.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  res.json({ message: "Team deleted" });
};

/* ---------- Invite Member ---------- */
export const inviteMember = async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ message: "Team not found" });
  if (!team.owner.equals(req.userId))
    return res.status(403).json({ message: "Not team owner" });

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (team.members.includes(user._id))
    return res.status(400).json({ message: "Already a member" });

  team.members.push(user._id);
  await team.save();
  res.json({ message: "Member added", team });
};

/* ---------- PROJECT CRUD ---------- */
export const createProject = async (req, res) => {
  const { name, description, team } = req.body;
  try {
    const project = await Project.create({
      name,
      description,
      team,
      owner: req.userId,
    });
    res.status(201).json(project);
  } catch {
    res.status(500).json({ message: "Create project failed" });
  }
};

export const getProjectsByTeam = async (req, res) => {
  const projects = await Project.find({ team: req.params.teamId });
  res.json(projects);
};

export const updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project);
};

export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
};
