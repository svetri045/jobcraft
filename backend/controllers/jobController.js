import Job from "../models/Job.js";

// ==========================================
// Create Job
// ==========================================
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      salary,
      companyName,
    } = req.body;


    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can post jobs.",
      });
    }


    const job = await Job.create({
      title,
      description,
      location,
      salary,

      company: {
        name: companyName,
      },

      createdBy: req.user._id,
    });


    return res.status(201).json({
      success: true,
      message: "Job Posted Successfully",
      job,
    });


  } catch (error) {

    console.error("Create Job Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================
// Get All Jobs
// ==========================================
export const getAllJobs = async (req, res) => {

  try {

    const jobs = await Job.find()
      .sort({ createdAt: -1 });


    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });


  } catch (error) {

    console.error("Get All Jobs Error:", error);


    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================
// Get Single Job By ID
// ==========================================
export const getJobById = async (req, res) => {

  try {

    const job = await Job.findById(req.params.id);


    if (!job) {

      return res.status(404).json({
        success: false,
        message: "Job not found",
      });

    }


    return res.status(200).json({
      success: true,
      job,
    });


  } catch (error) {

    console.error("Get Job Error:", error);


    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



// ==========================================
// Get My Jobs
// ==========================================
export const getMyJobs = async (req, res) => {

  try {

    const jobs = await Job.find({
      createdBy: req.user._id,
    })
    .sort({ createdAt: -1 });


    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });


  } catch (error) {

    console.error("Get My Jobs Error:", error);


    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



// ==========================================
// Update Job
// ==========================================
export const updateJob = async (req, res) => {

  try {

    const { id } = req.params;


    const job = await Job.findById(id);


    if (!job) {

      return res.status(404).json({
        success: false,
        message: "Job not found",
      });

    }



    // Check owner
    if (
      job.createdBy.toString() !== req.user._id.toString()
    ) {

      return res.status(403).json({
        success: false,
        message: "You are not authorized",
      });

    }



    const updatedJob =
      await Job.findByIdAndUpdate(

        id,

        {
          title: req.body.title,

          description: req.body.description,

          location: req.body.location,

          salary: req.body.salary,


          company: {
            name: req.body.companyName,
          },

        },

        {
          new: true,
          runValidators: true,
        }

      );



    return res.status(200).json({

      success: true,

      message: "Job Updated Successfully",

      job: updatedJob,

    });



  } catch (error) {


    console.error("Update Job Error:", error);


    return res.status(500).json({

      success: false,

      message: error.message,

    });


  }

};



// ==========================================
// Delete Job
// ==========================================
export const deleteJob = async (req, res) => {

  try {

    const { id } = req.params;


    const job = await Job.findById(id);



    if (!job) {

      return res.status(404).json({
        success: false,
        message: "Job not found",
      });

    }



    if (
      job.createdBy.toString() !== req.user._id.toString()
    ) {

      return res.status(403).json({

        success: false,

        message:
          "You are not authorized to delete this job.",

      });

    }



    await Job.findByIdAndDelete(id);



    return res.status(200).json({

      success: true,

      message: "Job Deleted Successfully",

    });



  } catch (error) {


    console.error("Delete Job Error:", error);


    return res.status(500).json({

      success: false,

      message: error.message,

    });


  }

};