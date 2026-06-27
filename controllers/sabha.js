const Sabha = require("../models/sabha");
const asyncHandler = require("../common/asyncHandler");

// GET /sabha — all sabhas
const getsabhas = asyncHandler(async (req, res) => {
  const sabhadetails = await Sabha.find({}).populate("sabha_leader");
  res.status(200).json({ count: sabhadetails.length, sabhadetails });
});

// GET /sabha/:id — single sabha
const getsabha = asyncHandler(async (req, res) => {
  const sabha = await Sabha.findById(req.params.id).populate("sabha_leader");
  if (!sabha) {
    res.status(404);
    throw new Error("Sabha not found");
  }
  res.status(200).json(sabha);
});

// POST /sabha/register — create a sabha (admin)
const createsabha = asyncHandler(async (req, res) => {
  const { sabha_name, sabha_type, sabha_location, sabha_leader } = req.body;
  if (!sabha_name || !sabha_type || !sabha_location) {
    res.status(400);
    throw new Error("sabha_name, sabha_type and sabha_location are required");
  }

  const existing = await Sabha.findOne({ sabha_name });
  if (existing) {
    res.status(400);
    throw new Error("This sabha already exists in database");
  }

  const newsabha = await Sabha.create({
    sabha_name,
    sabha_type,
    sabha_location,
    sabha_leader,
  });
  res
    .status(201)
    .json({ message: "Your sabha was created successfully", newsabha });
});

// PATCH /sabha/:id — update a sabha (admin)
const updatesabha = asyncHandler(async (req, res) => {
  const updated = await Sabha.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!updated) {
    res.status(404);
    throw new Error("Sabha not found");
  }
  res.status(200).json({ message: "Sabha updated successfully", sabha: updated });
});

// DELETE /sabha/:id — delete a sabha (admin)
const deletesabha = asyncHandler(async (req, res) => {
  const deleted = await Sabha.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404);
    throw new Error("Sabha not found");
  }
  res.status(200).json({ message: "Your sabha was deleted successfully" });
});

module.exports = {
  getsabha,
  createsabha,
  updatesabha,
  deletesabha,
  getsabhas,
};
