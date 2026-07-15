import Application from "../models/Application.js";
import Job from "../models/Job.js";

// ==========================================
// Apply for a Job
// ==========================================
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found",
      });
    }

    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already Applied For This Job",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Application Submitted Successfully",
      application,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Logged User Applications
// ==========================================
export const myApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate({
        path: "job",
        populate: {
          path: "createdBy",
          select: "name email role",
        },
      })
      .populate("applicant", "name email");

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("My Applications Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Recruiter Applications
// ==========================================
export const getRecruiterApplications = async (
  req,
  res
) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user._id,
    });

    const jobIds = jobs.map(
      (job) => job._id
    );

    const applications =
      await Application.find({
        job: {
          $in: jobIds,
        },
      })
        .populate({
          path: "job",
          populate: {
            path: "createdBy",
            select: "name email role",
          },
        })
        .populate(
          "applicant",
          "name email"
        );

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Recruiter Applications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Update Application Status
// ==========================================
export const updateStatus = async (
  req,
  res
) => {
  try {
    const application =
      await Application.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Application Status Updated Successfully",
      application,
    });
  } catch (error) {
    console.error(
      "Update Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};