import User from "../models/User.js";
import Company from "../models/Company.js";
import generateToken from "../utils/generateToken.js";


// =========================================
// Register User
// =========================================

export const registerUser = async (req, res) => {

  try {


    const {
      name,
      email,
      password,
      phone,
      role,
      companyName,
      companyWebsite,
      companyDescription,

    } = req.body;



    if(!name || !email || !password){

      return res.status(400).json({

        success:false,

        message:"Please fill all required fields"

      });

    }




    const existingUser = await User.findOne({

      email:email.toLowerCase()

    });



    if(existingUser){

      return res.status(400).json({

        success:false,

        message:"Email already registered"

      });

    }





    // Recruiter validation

    if(role === "recruiter" && !companyName){

      return res.status(400).json({

        success:false,

        message:"Company Name is required for recruiter"

      });

    }






    // Create User

    const user = await User.create({

      name,

      email:email.toLowerCase(),

      password,

      phone:phone || "",

      role:role || "seeker",


      companyName:companyName || "",

      companyWebsite:companyWebsite || "",

      companyDescription:companyDescription || "",


    });







    // Create Company

    if(user.role === "recruiter"){


      const existingCompany =
        await Company.findOne({

          companyName:companyName

        });



      if(existingCompany){


        await User.findByIdAndDelete(user._id);


        return res.status(400).json({

          success:false,

          message:"Company already registered"

        });


      }





      await Company.create({

        recruiterId:user._id,

        companyName:companyName,

        companyWebsite:companyWebsite || "",

        companyDetails:companyDescription || "",

      });


    }







    return res.status(201).json({

      success:true,

      message:"Registration Successful",

      token:generateToken(user._id),


      user:{


        id:user._id,

        name:user.name,

        email:user.email,

        role:user.role,


        phone:user.phone,

        skills:user.skills,

        education:user.education,

        profilePic:user.profilePic,


        companyName:user.companyName,

        companyWebsite:user.companyWebsite,

        companyDescription:user.companyDescription


      }


    });




  }
  catch(error){


    console.error(

      "Register Error:",

      error.message

    );



    return res.status(400).json({

      success:false,

      message:error.message

    });


  }


};








// =========================================
// Login User
// =========================================

export const loginUser = async(req,res)=>{


try{


const {
 email,
 password

}=req.body;




if(!email || !password){

return res.status(400).json({

success:false,

message:"Email and Password are required"

});

}




const user = await User.findOne({

email:email.toLowerCase()

});




if(!user){

return res.status(401).json({

success:false,

message:"Invalid Email or Password"

});

}




const isMatch =
await user.matchPassword(password);



if(!isMatch){

return res.status(401).json({

success:false,

message:"Invalid Email or Password"

});

}





return res.status(200).json({

success:true,

message:"Login Successful",

token:generateToken(user._id),


user:{


id:user._id,

name:user.name,

email:user.email,

role:user.role,

phone:user.phone,

skills:user.skills,

education:user.education,

profilePic:user.profilePic,

companyName:user.companyName,

companyWebsite:user.companyWebsite,

companyDescription:user.companyDescription


}


});



}
catch(error){


console.error(
"Login Error:",
error.message
);



return res.status(500).json({

success:false,

message:error.message

});


}


};









// =========================================
// Update User Profile
// =========================================

export const updateUser = async(req,res)=>{


try{


const updatedUser =
await User.findByIdAndUpdate(

req.params.id,

{

...req.body

},

{

new:true,

runValidators:true

}

).select("-password");




if(!updatedUser){

return res.status(404).json({

success:false,

message:"User not found"

});

}



return res.status(200).json({

success:true,

message:"Profile Updated Successfully",

user:updatedUser

});


}
catch(error){


console.error(
"Update Error:",
error.message
);



return res.status(500).json({

success:false,

message:error.message

});


}


};








// =========================================
// Get Logged User
// =========================================

export const getUserProfile = async(req,res)=>{


try{


const user =
await User.findById(req.user._id)
.select("-password");




if(!user){

return res.status(404).json({

success:false,

message:"User not found"

});

}



return res.status(200).json({

success:true,

user

});



}
catch(error){


console.error(
"Profile Error:",
error.message
);



return res.status(500).json({

success:false,

message:error.message

});


}


};