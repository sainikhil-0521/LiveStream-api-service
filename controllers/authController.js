const UserProfile = require("../models/UserProfileSchema");
const UserLogin = require("../models/UserLoginSchema");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
// src/controllers/UserController.js
class AuthController {
  constructor() {}

  // Method to get all users
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserProfile.findOne({
        email: email,
      });
      if (!user) {
        return res.status(404).json({ success: 0, message: "User not found" });
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(404)
            .json({ success: 0, message: "Invalid Password" });
        }
      }
      const userDetails = {
        userId: user.userId,
        userName: user.userName,
        email: user.email,
      };
      const sessionId = uuidv4();
      const session = new UserLogin({
        sessionId,
        userId: user.userId,
      });

      await session.save();
      res.cookie("sessionId", sessionId, {
        httpOnly: true, // Secure, only accessible via HTTP (not JavaScript)
        maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
      });
      return res.status(200).json({ success: 1, data: userDetails });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: 0, message: "Failed Authentication" });
    }
  }

  // Method to create a new user
  async signup(req, res) {
    try {
      const { email, password, username } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new UserProfile({
        userName: username,
        email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      const userDetails = {
        userId: savedUser.userId,
        userName: savedUser.userName,
        email: savedUser.email,
      };
      res.status(200).json({ success: 1, data: userDetails });
    } catch (error) {
      // Check for duplicate key error (E11000)
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0]; // Get the field causing the error
        res.status(400).json({
          status: 0,
          error: `${field} must be unique. '${error.keyValue[field]}' already exists.`,
        });
      } else {
        res.status(500).json({ status: 0, error: error.message });
      }
    }
  }

  // Example of a custom helper method within the class
  async verifyUser(req, res) {
    const { sessionId } = req.cookies;
    if (!sessionId) {
      return res
        .status(400)
        .json({ status: 0, message: "No session ID found" });
    }

    try {
      const session = await UserLogin.findOne({ sessionId });
      if (!session) {
        return res
          .status(400)
          .json({ status: 0, message: "Session not found" });
      }
      return res
        .status(200)
        .json({ status: 1, message: "Session found", session });
    } catch (err) {
      console.error("Error fetching session:", err);
      res.status(500).json({ status: 0, message: "Server error" });
    }
  }
}

module.exports = AuthController;
