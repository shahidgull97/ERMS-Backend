import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    engineerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    allocationPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    role: {
      type: String,
      enum: ["Developer", "Tech Lead", "Architect"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Assignment", assignmentSchema);
