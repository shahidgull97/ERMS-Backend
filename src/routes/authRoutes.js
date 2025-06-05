import express from "express";
import { login, register, isLoggedIn } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/isloggedin", authenticate, isLoggedIn);

export default router;
