import express from "express";
import Job from "../models/Job.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// Create Job
// ==========================================
router.post("/", protect, async (req, res) => {
  try {

    const {
      title,
      description,
      location,
      salary,
      companyName,
      vacancies,
      duration
    } = req.body;


    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success:false,
        message:"Only recruiters can post jobs."
      });
    }


    // Calculate Expiry Date
    const expiryDate = new Date();

    expiryDate.setDate(
      expiryDate.getDate() + Number(duration || 30)
    );



    const job = await Job.create({

      title,

      description,

      location,

      salary,

      company: companyName,

      vacancies: Number(vacancies || 1),

      expiryDate,

      createdBy:req.user._id

    });



    return res.status(201).json({

      success:true,

      message:"Job Posted Successfully",

      job

    });



  } catch(error){

    console.error(
      "Create Job Error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:error.message

    });

  }
});




// ==========================================
// Get My Jobs
// ==========================================
router.get("/my-jobs", protect, async(req,res)=>{

  try{


    const jobs = await Job.find({

      createdBy:req.user._id

    })
    .sort({
      createdAt:-1
    });



    return res.status(200).json({

      success:true,

      jobs

    });



  }catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

});




// ==========================================
// Get All Jobs
// ==========================================
router.get("/", async(req,res)=>{

  try{


    // Remove expired jobs automatically

    await Job.deleteMany({

      expiryDate:{
        $lt:new Date()
      }

    });



    const jobs = await Job.find()
    .sort({
      createdAt:-1
    });



    return res.status(200).json({

      success:true,

      jobs

    });



  }catch(error){


    res.status(500).json({

      success:false,

      message:error.message

    });


  }

});




// ==========================================
// Get Single Job
// ==========================================
router.get("/:id", async(req,res)=>{

  try{


    const job = await Job.findById(
      req.params.id
    );


    if(!job){

      return res.status(404).json({

        success:false,

        message:"Job not found"

      });

    }


    return res.status(200).json({

      success:true,

      job

    });



  }catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

});





// ==========================================
// Update Job
// ==========================================
router.put("/:id", protect, async(req,res)=>{

  try{


    const job = await Job.findById(
      req.params.id
    );


    if(!job){

      return res.status(404).json({

        success:false,

        message:"Job not found"

      });

    }



    if(
      job.createdBy.toString()
      !== req.user._id.toString()
    ){

      return res.status(403).json({

        success:false,

        message:"Unauthorized"

      });

    }




    let expiryDate = job.expiryDate;


    if(req.body.duration){

      expiryDate = new Date();

      expiryDate.setDate(
        expiryDate.getDate() +
        Number(req.body.duration)
      );

    }





    const updatedJob =
    await Job.findByIdAndUpdate(

      req.params.id,

      {

        title:req.body.title,

        description:req.body.description,

        location:req.body.location,

        salary:req.body.salary,

        company:req.body.companyName,

        vacancies:Number(
          req.body.vacancies
        ),

        expiryDate

      },

      {
        new:true,
        runValidators:true
      }

    );




    return res.status(200).json({

      success:true,

      message:"Job Updated Successfully",

      job:updatedJob

    });



  }catch(error){


    res.status(500).json({

      success:false,

      message:error.message

    });


  }

});





// ==========================================
// Delete Job
// ==========================================
router.delete("/:id", protect, async(req,res)=>{

  try{


    const job = await Job.findById(
      req.params.id
    );


    if(!job){

      return res.status(404).json({

        success:false,

        message:"Job not found"

      });

    }



    if(
      job.createdBy.toString()
      !== req.user._id.toString()
    ){

      return res.status(403).json({

        success:false,

        message:"Unauthorized"

      });

    }



    await Job.findByIdAndDelete(
      req.params.id
    );



    return res.status(200).json({

      success:true,

      message:"Job Deleted Successfully"

    });



  }catch(error){


    res.status(500).json({

      success:false,

      message:error.message

    });


  }

});



export default router;