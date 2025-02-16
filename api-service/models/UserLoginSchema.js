const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDetails = new Schema(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    userName: { type: String, required: true },
  },
  {
    _id: false,
    strict: false,
    minimize: false,
  }
);

const UserLoginSchema = new Schema(
  {
    userDetails: UserDetails,
    ipAddress: { type: String },
    sessionId: { type: String },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true, strict: false, minimize: false }
);

const UserLogin = mongoose.model("userlogin", UserLoginSchema);

module.exports = UserLogin;
