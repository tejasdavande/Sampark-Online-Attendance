const Bhulku = require("../models/bhulku");
const asyncHandler = require("../common/asyncHandler");

// GET /birthday/day?date=YYYY-MM-DD — birthdays on a given day
const bydate = asyncHandler(async (req, res) => {
  const date = new Date(req.query.date || Date.now());
  const day = date.getDate();
  const month = date.getMonth() + 1;

  const fetchbhulku = await Bhulku.aggregate([
    {
      $project: {
        month: { $month: "$Date_Of_Birth" },
        day: { $dayOfMonth: "$Date_Of_Birth" },
        name: "$First_Name",
        address: "$Address",
        mobile: "$Mobile",
      },
    },
    { $match: { month, day } },
  ]);

  res.status(200).json({ message: "Birthday list", count: fetchbhulku.length, fetchbhulku });
});

// GET /birthday/month?date=YYYY-MM-DD — birthdays in a given month
const bymonth = asyncHandler(async (req, res) => {
  const date = new Date(req.query.date);
  const month = date.getMonth() + 1;

  const fetchbhulku = await Bhulku.aggregate([
    {
      $project: {
        month: { $month: "$Date_Of_Birth" },
        name: "$First_Name",
        address: "$Address",
        mobile: "$Mobile",
      },
    },
    { $match: { month } },
  ]);

  res.status(200).json({ message: "Birthday list", count: fetchbhulku.length, fetchbhulku });
});

// GET /birthday/range — birthdays within a day/month range
const byrange = asyncHandler(async (req, res) => {
  const fromdate = new Date(req.query.dateOfbirth.gte);
  const todate = new Date(req.query.dateOfbirth.lte);
  const fromday = fromdate.getDate();
  const frommonth = fromdate.getMonth() + 1;
  const today = todate.getDate();
  const tomonth = todate.getMonth() + 1;

  const fetchbhulku = await Bhulku.aggregate([
    {
      $project: {
        month: { $month: "$Date_Of_Birth" },
        day: { $dayOfMonth: "$Date_Of_Birth" },
        name: "$First_Name",
        address: "$Address",
        mobile: "$Mobile",
        dateOfbirth: "$Date_Of_Birth",
      },
    },
    {
      $match: {
        month: { $gte: frommonth, $lte: tomonth },
        day: { $gte: fromday, $lte: today },
      },
    },
  ]);

  res.status(200).json({
    message: "Birthday list for provided range",
    count: fetchbhulku.length,
    fetchbhulku,
  });
});

module.exports = { bydate, bymonth, byrange };
