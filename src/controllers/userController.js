import User from "../models/user.js";
import Assignment from "../models/assignment.js";

export const getEngineers = async (req, res) => {
  try {
    const { skills, minCapacity } = req.query;
    const filter = { role: "engineer" };

    if (skills) {
      const skillsArray = skills.split(",");
      filter.skills = { $in: skillsArray };
    }

    if (minCapacity) {
      filter.currentCapacity = { $gte: parseInt(minCapacity) };
    }

    const engineers = await User.find(filter)
      .select("-password")
      .sort("-currentCapacity");

    res.json(engineers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEngineerById = async (req, res) => {
  try {
    const engineer = await User.findById(req.params.id).select("-password");

    if (!engineer || engineer.role !== "engineer") {
      return res.status(404).json({ message: "Engineer not found" });
    }

    const assignments = await Assignment.find({
      engineerId: engineer._id,
    }).populate("projectId", "name description status");

    res.json({ engineer, assignments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateEngineer = async (req, res) => {
  try {
    const { skills, department } = req.body;

    const engineer = await User.findByIdAndUpdate(
      req.params.id,
      { skills, department },
      { new: true, runValidators: true }
    ).select("-password");

    if (!engineer || engineer.role !== "engineer") {
      return res.status(404).json({ message: "Engineer not found" });
    }

    res.json(engineer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEngineerCapacityReport = async (req, res) => {
  try {
    const engineers = await User.find({ role: "engineer" }).select(
      "name email currentCapacity maxCapacity skills department"
    );

    const report = engineers.map((engineer) => ({
      ...engineer.toObject(),
      utilizationRate: (
        ((engineer.maxCapacity - engineer.currentCapacity) /
          engineer.maxCapacity) *
        100
      ).toFixed(2),
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
