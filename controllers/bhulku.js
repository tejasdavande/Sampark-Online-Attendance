const Bhulku = require("../models/bhulku");
const asyncHandler = require("../common/asyncHandler");

// GET /bhulku — all members
const getbhulkus = asyncHandler(async (req, res) => {
  const bhulkudetails = await Bhulku.find({});
  res.status(200).json({ count: bhulkudetails.length, bhulkudetails });
});

// GET /bhulku/:id — single member
const getbhulku = asyncHandler(async (req, res) => {
  const bhulkudetails = await Bhulku.findById(req.params.id);
  if (!bhulkudetails) {
    res.status(404);
    throw new Error("Bhulku is not available in database");
  }
  res.status(200).json({ bhulkudetails });
});

// POST /bhulku — create a member
const createbhulku = asyncHandler(async (req, res) => {
  const { First_Name, Address, Mobile, Gender } = req.body;
  if (!First_Name || !Address || !Mobile) {
    res.status(400);
    throw new Error(
      "First_Name, Address and Mobile are mandatory to create an entry"
    );
  }

  const count = await Bhulku.countDocuments();
  const bhulku = await Bhulku.create({
    Member_id: String(count + 1),
    First_Name,
    Address,
    Mobile,
    Gender,
    Date_Of_Birth: req.body.Date_Of_Birth,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    user_type: req.body.user_type || "yuvak",
    createdAt: Date.now(),
  });

  res.status(201).json({ message: "Bhulku was created successfully", bhulku });
});

// PATCH /bhulku/:id — update a member
const updatebhulku = asyncHandler(async (req, res) => {
  const updated = await Bhulku.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!updated) {
    res.status(404);
    throw new Error("Bhulku is not available in database");
  }
  res.status(200).json({ message: "Details are updated", bhulku: updated });
});

// DELETE /bhulku/:id — delete a member (admin)
const deletebhulku = asyncHandler(async (req, res) => {
  const deleted = await Bhulku.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404);
    throw new Error("Bhulku is not available in database");
  }
  res.status(200).json({ message: "Bhulku deleted successfully" });
});

module.exports = {
  getbhulkus,
  createbhulku,
  updatebhulku,
  deletebhulku,
  getbhulku,
};
