import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
  getUserProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   Public Routes
=========================== */

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

/* ===========================
   Protected Routes
=========================== */

// Get Logged-in User
router.get("/me", protect, getUserProfile);

// Update Profile
router.put("/update/:id", protect, updateUser);

export default router;