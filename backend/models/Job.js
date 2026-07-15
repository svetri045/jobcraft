import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: String,
      required: true,
      trim: true,
    },


    company: {
      type: String,
      required: true,
      trim: true,
    },


    // Number of openings
    vacancies: {
      type: Number,
      required: true,
      default: 1,
    },


    // Job expiry date
    expiryDate: {
      type: Date,
      required: true,
    },


    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  },
  {
    timestamps:true,
  }
);


// Auto remove expired jobs
jobSchema.index(
  { expiryDate: 1 },
  { expireAfterSeconds: 0 }
);


const Job = mongoose.model(
  "Job",
  jobSchema
);


export default Job;