const mongoose = require("mongoose");
const Attendance = require("../models/attendance");
const asyncHandler = require("../common/asyncHandler");

// POST /attendance/newattedance — create attendance for a sabha + date
const createAttendance = asyncHandler(async (req, res) => {
  const { sabha, sabhadate } = req.body;
  if (!sabha || !sabhadate) {
    res.status(400);
    throw new Error("sabha and sabhadate are required");
  }

  const existing = await Attendance.findOne({ sabha, sabhadate });
  if (existing) {
    res.status(400);
    throw new Error("Attendance for this sabha is already created");
  }

  const attendance = await Attendance.create({
    sabha,
    sabhadate,
    attendees: req.body.attendees,
    nonattendees: req.body.nonattendees,
  });
  res
    .status(201)
    .json({ message: "Your attendance was created successfully", attendance });
});

// GET /attendance/search?id=<sabhaId>&sabhadate=<date>
const getAttendance = asyncHandler(async (req, res) => {
  const { id, sabhadate } = req.query;
  const attendance = await Attendance.findOne(
    { sabha: id, sabhadate: new Date(sabhadate) },
    { sabhadate: 1, _id: 0, attendees: 1, nonattendees: 1, sabha: 1 }
  ).populate(["attendees", "nonattendees"]);

  if (!attendance) {
    res.status(404);
    throw new Error("No attendance found for the given sabha and date");
  }

  res.status(200).json({
    message: "Please find your attendance",
    attendees: attendance.attendees,
    nonattendees: attendance.nonattendees,
  });
});

// PATCH /attendance/:id — update by attendance id (admin)
const updateAttendancebyid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Please provide a correct ID");
  }
  const updateattendance = await Attendance.updateOne(
    { _id: id },
    { $set: req.body }
  );
  res
    .status(200)
    .json({ message: "Attendance updated", updateattendance });
});

// PATCH /attendance — update by sabha + date (admin)
const updateAttendancebydateandsabha = asyncHandler(async (req, res) => {
  const { sabha, sabhadate } = req.body;
  if (!sabha && !sabhadate) {
    res.status(400);
    throw new Error("Please provide a correct sabha and sabhadate");
  }
  const updateattendance = await Attendance.updateOne(
    { sabha, sabhadate: new Date(sabhadate) },
    { $set: req.body }
  );
  res
    .status(200)
    .json({ message: "Attendance updated", updateattendance });
});

// DELETE /attendance/:id (admin)
const deleteAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Please provide a correct ID");
  }
  await Attendance.deleteOne({ _id: id });
  res.status(200).json({ message: "Attendance was deleted successfully" });
});

module.exports = {
  createAttendance,
  getAttendance,
  updateAttendancebyid,
  updateAttendancebydateandsabha,
  deleteAttendance,
};
