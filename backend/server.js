import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";


dotenv.config();


const app = express();


// ===================================
// Path Configuration
// ===================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ===================================
// Upload Folder (Local Only)
// ===================================

const uploadPath = path.join(__dirname, "uploads");


if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}


// ===================================
// Middlewares
// ===================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);


app.use(
  express.json({
    limit: "20mb",
  })
);


app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb",
  })
);


// Static uploads

app.use(
  "/uploads",
  express.static(uploadPath)
);



// ===================================
// MongoDB Connection
// ===================================

let isConnected = false;


const connectDB = async () => {

  if (isConnected) {
    return;
  }


  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );


    isConnected = true;


    console.log(
      "✅ MongoDB Connected"
    );


  } catch (error) {

    console.log(
      "❌ MongoDB Connection Error:",
      error.message
    );


    throw error;

  }

};



// ===================================
// Test Route
// ===================================

app.get("/", async (req, res) => {

  await connectDB();


  res.status(200).json({

    success: true,

    message:
      "Job Portal Backend Running 🚀",

  });

});



// ===================================
// API Routes
// ===================================

app.use(
  "/api/auth",
  async (req, res, next) => {

    await connectDB();

    next();

  },
  authRoutes
);



app.use(
  "/api/jobs",
  async (req, res, next) => {

    await connectDB();

    next();

  },
  jobRoutes
);



app.use(
  "/api/applications",
  async (req, res, next) => {

    await connectDB();

    next();

  },
  applicationRoutes
);




// ===================================
// 404 Handler
// ===================================

app.use(
  (req, res) => {

    res.status(404).json({

      success: false,

      message: "Route Not Found",

    });

  }
);



// ===================================
// Global Error Handler
// ===================================

app.use(
  (err, req, res, next) => {

    console.error(
      "ERROR:",
      err
    );


    res.status(
      err.status || 500
    ).json({

      success: false,

      message:
        err.message ||
        "Internal Server Error",

    });

  }
);



// ===================================
// Vercel Export
// ===================================

export default app;



// ===================================
// Local Development Server
// ===================================

if (process.env.NODE_ENV !== "production") {


  const PORT =
    process.env.PORT || 5000;


  connectDB()
    .then(() => {


      app.listen(
        PORT,
        "0.0.0.0",
        () => {


          console.log(
            `🚀 Server running on port ${PORT}`
          );


        }
      );


    })
    .catch((error)=>{


      console.log(
        "Server Start Error:",
        error.message
      );


    });

}