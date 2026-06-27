const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    user_type: { type: String, enum: ["admin", "sabhaleader"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userschema);
