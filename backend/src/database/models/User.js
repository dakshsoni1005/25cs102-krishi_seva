const mongoose = require("mongoose");
const { ROLES } = require("../../config/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: { unique: true, sparse: true } // sparse: true allows multiple empty/null emails
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false // hides password hash by default in query returns
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.FARMER
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model("User", userSchema);
