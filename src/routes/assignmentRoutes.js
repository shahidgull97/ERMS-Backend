import express from "express";
import {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, authorize("manager"), createAssignment);
router.get("/", authenticate, getAssignments);
router.put("/:id", authenticate, authorize("manager"), updateAssignment);
router.delete("/:id", authenticate, authorize("manager"), deleteAssignment);

export default router;
