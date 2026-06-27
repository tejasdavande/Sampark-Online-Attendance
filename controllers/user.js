const User = require("../models/user");
const bcrypt = require("bcrypt"); // password hashing
const jwt = require("jsonwebtoken"); // token generation
const asyncHandler = require("../common/asyncHandler");
require("dotenv").config();

// POST /user/signup — register a new user
const createuser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const existing = await User.findOne({ username });
  if (existing) {
    res.status(400);
    throw new Error("User is already registered");
  }

  const hashpassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashpassword,
    user_type: req.body.user_type,
  });

  res.status(201).json({ message: "User was created", userId: user._id });
});

// POST /user/login — authenticate and return a JWT
const loginuser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("Please provide username and password");
  }

  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accesstoken = jwt.sign(
      {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          user_type: user.user_type,
        },
      },
      process.env.PRIVATEKEY,
      { expiresIn: "12h" }
    );
    return res.status(200).json({ accesstoken });
  }

  res.status(401);
  throw new Error("Please provide correct username and password");
});

// GET /user — list all users (admin)
const getusers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({ count: users.length, users });
});

// GET /user/:id — fetch a single user (admin)
const getuser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

// DELETE /user/:id — remove a user (admin)
const deleteuser = asyncHandler(async (req, res) => {
  const result = await User.deleteOne({ _id: req.params.id });
  if (result.deletedCount === 0) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({ message: "User was deleted successfully" });
});

// PATCH /user/newpassword/:id — reset a user's password (admin)
const newuser = asyncHandler(async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const update = await User.updateOne(
    { _id: req.params.id },
    { $set: { password: hashed, username: req.body.username } }
  );
  if (update.matchedCount === 0) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({ message: "Password updated successfully" });
});

module.exports = {
  createuser,
  loginuser,
  getusers,
  getuser,
  deleteuser,
  newuser,
};
