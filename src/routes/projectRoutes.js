import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, authorize("manager"), createProject);
router.get("/", authenticate, getProjects);
router.get("/:id", authenticate, getProjectById);
router.put("/:id", authenticate, authorize("manager"), updateProject);
router.delete("/:id", authenticate, authorize("manager"), deleteProject);

export default router;
