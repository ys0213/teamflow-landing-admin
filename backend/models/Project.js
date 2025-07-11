import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    description: String,
    status:      { type: String, enum: ["todo", "doing", "done"], default: "todo" },
    team:        { type: mongoose.Types.ObjectId, ref: "Team", required: true },
    owner:       { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);