const User = require("../models/userModel");
const Section = require("../models/sectionModel");
const Page = require("../models/pageModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const sendMail = require("../config/nodeMailler");
const { generateHTML } = require("../utils");

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "5h",
  });
  return token;
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const checkPasswordExpiry = async (user, res) => {
  try {
    if (
      user.forgotPasswordOTPExpiry != null &&
      user.forgotPasswordOTPExpiry < new Date()
    ) {
      user.forgotPasswordOTP = null;
      user.forgotPasswordOTPExpiry = null;
      await user.save();
      res.status(400).json({ message: "OTP expired" });
      return true;
    }
    return false;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const auth = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check user exits
    let user = await User.findOne({ email });

    if (!user) {
      //add user if not exits
      await User.create({
        email,
        password,
      });
    }

    user = await User.findOne({ email }).populate({
      path: "sections",
      populate: [
        { path: "pages", select: "-content" },
        { path: "canvases", select: "-content" },
      ],
    });
    if (!(await user.matchPassword(password))) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", status: false, error: true });
    }
    const token = generateToken(user._id);

    res
      .status(200)
      .json({ token, user, message: "success", status: true, error: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.forgotPasswordOTP && user.forgotPasswordOTPExpiry > new Date()) {
      const remainingMin = Math.ceil(
        (user.forgotPasswordOTPExpiry - new Date() + 1) / 60000,
      );
      return res
        .status(400)
        .json({ message: `OTP already sent or wait for ${remainingMin} min` });
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    const htmlContent = generateHTML(otp, user._id);

    await sendMail(email, "Password Reset OTP", htmlContent);

    user.forgotPasswordOTP = otp;
    user.forgotPasswordOTPExpiry = expiry;

    await user.save();

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(user);
    if (await checkPasswordExpiry(user, res)) return;

    if (Number(otp) !== user.forgotPasswordOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified", status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(user);

    if (await checkPasswordExpiry(user, res)) return;

    user.password = password; // will be hashed automatically in pre-save
    user.forgotPasswordOTP = null;
    user.forgotPasswordOTPExpiry = null;

    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { darkMode } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (darkMode != null) {
      console.log(darkMode);
      user.isDarkMode = darkMode;
    }
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  auth,
  sendOTP,
  verifyOTP,
  resetPassword,
  updateUser,
  generateToken,
  generateOTP,
};

