import mongoose from "mongoose";


const companySchema = new mongoose.Schema(

  {

    recruiterId: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },



    companyName: {

      type: String,

      required: [true, "Company Name is required"],

      trim: true,

      unique: true,

    },



    companyWebsite: {

      type: String,

      default: "",

      trim: true,

    },



    companyDetails: {

      type: String,

      default: "",

      trim: true,

    },


  },

  {

    timestamps:true,

  }

);





const Company = mongoose.model(

  "Company",

  companySchema

);



export default Company;