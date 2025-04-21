const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/authController");

const auth = new AuthController();

// Correctly pass the methods as callback functions
router.post("/login", (req, res) => auth.login(req, res));
router.post("/signup", (req, res) => auth.signup(req, res));
router.post("/verify", (req, res) => auth.verifyUser(req, res));
router.post("/logout", (req, res) => auth.logout(req, res));
module.exports = router;
