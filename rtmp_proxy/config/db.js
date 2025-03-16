const mongoose = require("mongoose");
const logger = require("./bunyan");

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Other options can be added here as needed
    });
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error("Error connecting to MongoDB", err);
  }
};

module.exports = { connectDB };
