import Assignment from "../models/assignment.js";
import User from "../models/user.js";

export const createAssignment = async (req, res) => {
  try {
    const {
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role,
    } = req.body;

    // Check engineer's current capacity
    const engineer = await User.findById(engineerId);
    if (!engineer || engineer.role !== "engineer") {
      return res.status(400).json({ message: "Invalid engineer" });
    }

    if (engineer.currentCapacity < allocationPercentage) {
      return res.status(400).json({
        message: `Engineer only has ${engineer.currentCapacity}% capacity available`,
      });
    }

    const assignment = new Assignment({
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role,
    });

    await assignment.save();

    // Update engineer's capacity
    engineer.currentCapacity -= allocationPercentage;
    await engineer.save();

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const { engineerId, projectId } = req.query;
    const filter = {};

    if (engineerId) filter.engineerId = engineerId;
    if (projectId) filter.projectId = projectId;

    const assignments = await Assignment.find(filter)
      .populate("engineerId", "name email skills")
      .populate("projectId", "name description");

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const engineer = await User.findById(assignment.engineerId);

    // Restore previous capacity
    engineer.currentCapacity += assignment.allocationPercentage;

    // Check new capacity
    if (engineer.currentCapacity < req.body.allocationPercentage) {
      return res.status(400).json({
        message: `Engineer only has ${engineer.currentCapacity}% capacity available`,
      });
    }

    // Update assignment
    Object.assign(assignment, req.body);
    await assignment.save();

    // Update new capacity
    engineer.currentCapacity -= req.body.allocationPercentage;
    await engineer.save();

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Restore engineer's capacity
    const engineer = await User.findById(assignment.engineerId);
    engineer.currentCapacity += assignment.allocationPercentage;
    await engineer.save();

    await assignment.deleteOne();

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
