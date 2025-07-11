import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
