import express from "express";
import multer from "multer";

import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==============================
// Multer Configuration
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ==============================
// Apply Job
// ==============================
router.post(
  "/apply/:jobId",
  protect,
  upload.single("resume"),
  async (req, res) => {
    try {
      const { jobId } = req.params;
      const {
        name,
        contactNumber,
        currentJob,
        previousJob,
        expectedSalary,
      } = req.body;

      if (req.user.role !== "seeker") {
        return res.status(403).json({
          success: false,
          message: "Only job seekers can apply.",
        });
      }

      const resumeUrl = req.file
        ? `/uploads/${req.file.filename}`
        : "";

      if (!name || !contactNumber || !expectedSalary || !resumeUrl) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required fields.",
        });
      }

      const job = await Job.findById(jobId);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found.",
        });
      }

      const alreadyApplied = await Application.findOne({
        job: jobId,
        applicant: req.user._id,
      });

      if (alreadyApplied) {
        return res.status(400).json({
          success: false,
          message: "You have already applied for this job.",
        });
      }

      const application = await Application.create({
        job: jobId,
        applicant: req.user._id,
        resumeUrl,
        coverLetter: `Name: ${name} | Phone: ${contactNumber} | Current: ${currentJob} | Previous: ${previousJob} | Expected Salary: ${expectedSalary}`,
      });

      return res.status(201).json({
        success: true,
        message: "Application submitted successfully.",
        application,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ==============================
// Recruiter Applications
// ==============================
router.get("/recruiter/my-applications", protect, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const myJobs = await Job.find({
      createdBy: req.user._id,
    }).select("_id");

    const jobIds = myJobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("job", "title location salary company")
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// Update Status
// ==============================
router.put("/status-update/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// My Applications
// ==============================
router.get("/my-applications", protect, async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate("job", "title location salary company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;