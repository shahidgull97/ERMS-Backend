import express from "express";
import {
  getEngineers,
  getEngineerById,
  updateEngineer,
  getEngineerCapacityReport,
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/engineers", authenticate, getEngineers);
router.get(
  "/engineers/capacity-report",
  authenticate,
  authorize("manager"),
  getEngineerCapacityReport
);
router.get("/engineers/:id", authenticate, getEngineerById);
router.put("/engineers/:id", authenticate, updateEngineer);

export default router;
