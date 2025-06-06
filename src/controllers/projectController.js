import Project from "../models/project.js";
import Assignment from "../models/assignment.js";

export const createProject = async (req, res) => {
  try {
    // console.log(`Creating project with data: ${JSON.stringify(req.body)}`);
    // console.log("does it reach here?");

    const project = new Project({
      ...req.body,
      managerId: req.user.userId,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("managerId", "name email")
      .sort("-createdAt");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProjectsByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    // console.log(`Fetching projects for user ID: ${userId}`);

    const projects = await Project.find({ engineerId: userId })
      .populate("managerId", "name email")
      .sort("-createdAt");

    if (projects.length === 0) {
      return res.status(200).json([]);
    }

    res.json(projects);
  } catch (error) {
    console.log(
      `Error fetching projects for user ID ${req.user.userId}:`,
      error
    );

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "managerId",
      "name email"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Get assignments for this project
    const assignments = await Assignment.find({
      projectId: project._id,
    }).populate("engineerId", "name email skills currentCapacity");

    res.json({ project, assignments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    console.log(
      `Updating project with ID: ${req.params.id} and data: ${JSON.stringify(
        req.body
      )}`
    );

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { engineerId: req.body.engineerId } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete all assignments for this project
    await Assignment.deleteMany({ projectId: project._id });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
