require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/db");
const logger = require("./config/bunyan");

const app = express();
const PORT = process.env.PORT || 80;

app.use(bodyParser());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());

app.get("/health", (req, res) =>
  res.json({ status: "success", message: "Server started" })
);

app.listen(PORT, async () => {
  await db.connectDB();
  logger.info(`Server is running on port ${PORT}`);
});
