const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const {
  authenticateAndSetUser,
} = require("../../middlewares/authenticateAndSetUser");


router.use("/auth", authRoutes);
router.use("/workflow", authenticateAndSetUser, workflowRoutes);
router.use("/execution", authenticateAndSetUser, executionRoutes);
router.use("/workflowRecipe", authenticateAndSetUser, recipeRoutes);

router.get("/", (req, res) => {
  res.json({ version: "v1", message: "Hello from Darwinbox API v1.0" });
});

module.exports = router;
