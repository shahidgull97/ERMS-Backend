import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";
import Project from "../models/project.js";
import Assignment from "../models/assignment.js";

dotenv.config();

export const seedDatabase = async () => {
  try {
    // await mongoose.connect(
    //   process.env.MONGODB_URI ||
    //     "mongodb://localhost:27017/engineering-resource-db"
    // );

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Assignment.deleteMany({});

    // Create managers
    const manager1 = await User.create({
      email: "manager1@company.com",
      password: "password123",
      name: "John Manager",
      role: "manager",
    });

    // Create engineers
    const engineers = await User.create([
      {
        email: "engineer1@company.com",
        password: "password123",
        name: "Alice Engineer",
        role: "engineer",
        skills: ["React", "Node.js"],
        currentCapacity: 80,
        department: "Frontend",
      },
      {
        email: "engineer2@company.com",
        password: "password123",
        name: "Bob Developer",
        role: "engineer",
        skills: ["Java", "Spring"],
        currentCapacity: 60,
        department: "Backend",
      },
      {
        email: "engineer3@company.com",
        password: "password123",
        name: "Charlie Fullstack",
        role: "engineer",
        skills: ["React", "Node.js", "Python"],
        currentCapacity: 100,
        department: "Fullstack",
      },
    ]);

    // Create projects
    const project1 = await Project.create({
      name: "E-commerce Platform",
      description: "Building a new e-commerce platform",
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      requiredSkills: ["React", "Node.js"],
      teamSize: 3,
      status: "active",
      managerId: manager1._id,
    });

    // Create assignments
    await Assignment.create({
      engineerId: engineers[0]._id,
      projectId: project1._id,
      allocationPercentage: 20,
      startDate: new Date(),
      role: "Developer",
    });

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// seedDatabase();
