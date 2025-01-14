const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserLoginSchema = new Schema(
  {
    userId: { type: String, required: true },
    ipAddress: { type: String },
    sessionId: { type: String },
  },
  { timestamps: true, strict: false, minimize: false }
);

const UserLogin = mongoose.model("userlogin", UserLoginSchema);

module.exports = UserLogin;
