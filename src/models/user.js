import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["manager", "engineer"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Engineer specific fields
    skills: [
      {
        type: String,
        enum: ["React", "Node.js", "Python", "Java", "Spring", "Angular"],
      },
    ],
    currentCapacity: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    maxCapacity: {
      type: Number,
      default: 100,
    },
    department: String,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
