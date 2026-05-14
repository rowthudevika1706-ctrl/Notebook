const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/mongo");
const {
  auth,
  sendOTP,
  verifyOTP,
  resetPassword,
  updateUser,
} = require("./controllers/userControllers");
const protect = require("./middlewares/authMiddleware");
const section_routes = require("./routes/sectionRoutes");
const page_routes = require("./routes/pageRoutes");
const ai_routes = require("./routes/aiRoutes");
const canvas_routes = require("./routes/canvasRoutes");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// Public Routes
app.post("/api/auth", auth);
app.post("/api/forgot-password/send-otp", sendOTP);
app.post("/api/forgot-password/verify-otp", verifyOTP);
app.post("/api/forgot-password/reset", resetPassword);

app.use(protect);

app.post("/api/update-user", updateUser);

// Section Routes
app.use("/api/section", section_routes);

// Page Routes
app.use("/api/page", page_routes);

// Canvas Routes
app.use("/api/canvas", canvas_routes);

// AI Routes
app.use("/api/ai", ai_routes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to connect to DB", error);
  }
};

startServer();
