import express from "express";

import {
  createCompany,
  getCompanies,
} from "../controllers/companyController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================================
// Create Company (Recruiter Only)
// ==========================================
router.post(
  "/",
  protect,
  authorizeRoles("recruiter"),
  createCompany
);

// ==========================================
// Get All Companies
// ==========================================
router.get("/", protect, getCompanies);

export default router;