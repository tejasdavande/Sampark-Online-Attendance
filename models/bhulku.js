const mongoose = require("mongoose");
const moment = require("moment");

const bhulkuschema = new mongoose.Schema(
  {
    Member_id: { type: String, required: true },
    sabha_id: {
      type: String,
      enum: ["Andheri", "vile-parle", "santacruz"],
    },
    Reference_Name: { type: String },
    First_Name: { type: String, required: true },
    Middle_Name: { type: String },
    Last_Name: { type: String },
    NickName: { type: String },
    user_type: { type: String },
    Gender: { type: String, enum: ["Male", "Female"] },
    Date_Of_Birth: { type: Date, trim: true },
    Address: { type: String, required: true },
    Mobile: { type: Number, required: true },
    Home_Phone: { type: Number },
    Office_Phone: { type: Number },
    email: { type: String },
    Educational_Qualification: {
      type: String,
      enum: [
        "Below secondary",
        "Higher Secondary",
        "Diploma",
        "Graduate",
        "Postgradute",
      ],
    },
    Major_Subject: { type: String },
    username: { type: String },
    password: { type: String },
    Educational_Status: { type: String, enum: ["Pursuing", "Completed"] },
    Attending_Sabha: { type: String, enum: ["Yes", "No"] },
    Follow_Up_Name: { type: String },
    Sabha_Joining_Date: { type: Date },
    Occupation: { type: String },
    Marital_Status: { type: String, enum: ["Married", "Unmarried"] },
    Blood_Group: { type: String, enum: ["A", "B", "AB", "O"] },
    Performing_Puja: { type: String, enum: ["Yes", "No"] },
    Nishtawan: { type: String, enum: ["Yes", "No"] },
    Languages_Known: {
      type: String,
      enum: ["Gujarati", "Hindi", "English", "Other"],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Store createdAt in IST.
bhulkuschema.pre("save", function (next) {
  this.createdAt = moment.utc(this.createdAt).utcOffset("+05:30").toDate();
  next();
});

module.exports = mongoose.model("Bhulku", bhulkuschema);
