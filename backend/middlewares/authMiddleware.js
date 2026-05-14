const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Bearer <token>

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Attach user to request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(444).json({ message: "Unauthorized" });
      }

      next();
    } catch (error) {
      return res.status(444).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(444).json({ message: "Not authorized, no token" });
  }
};

module.exports = protect;
