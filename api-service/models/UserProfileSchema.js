const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const Address = new Schema(
  {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: Number },
  },
  {
    _id: false,
    strict: false,
    minimize: false,
  }
);

const UserProfileSchema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number },
    countryCode: { type: String },
    password: { type: String, required: true, unique: true },
    address: Address,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false, minimize: false }
);

UserProfileSchema.pre("validate", async function (next) {
  const user = this;
  if (!user.isNew) {
    return next(); // Skip if password is not modified
  }
  try {
    user.userId = uuidv4();
    console.log("uidd ", user.userId);
    next();
  } catch (error) {
    next(error);
  }
});

const UserProfile = mongoose.model("userprofile", UserProfileSchema);

module.exports = UserProfile;
