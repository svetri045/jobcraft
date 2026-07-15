import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {

    // ===============================
    // Basic Details
    // ===============================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },


    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },


    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },


    role: {
      type: String,
      enum: ["seeker", "recruiter"],
      default: "seeker",
    },


    // ===============================
    // Contact Details
    // ===============================

    phone: {
      type: String,
      default: "",
      trim: true,
    },


    profilePic: {
      type: String,
      default: "",
    },


    // ===============================
    // Job Seeker Fields
    // ===============================

    skills: {
      type: [String],
      default: [],
    },


    education: {
      type: String,
      default: "",
    },


    // ===============================
    // Recruiter Fields
    // ===============================

    companyName: {
      type: String,
      default: "",
      trim: true,
    },


    companyWebsite: {
      type: String,
      default: "",
      trim: true,
    },


    companyDescription: {
      type: String,
      default: "",
      trim: true,
    },


  },
  {
    timestamps:true,
  }
);



// ===============================
// Hash Password
// ===============================

userSchema.pre("save", async function(){

  if(!this.isModified("password")) return;


  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );

});



// ===============================
// Compare Password
// ===============================

userSchema.methods.matchPassword =
async function(password){

  return bcrypt.compare(
    password,
    this.password
  );

};


const User = mongoose.model(
  "User",
  userSchema
);


export default User;