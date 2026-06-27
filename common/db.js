const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Connect to MongoDB. Reads the connection string from MONGODB_URI (preferred)
 * or URL (legacy name), falling back to a local instance so it runs out of the
 * box during development.
 */
const connectedDb = async () => {
  const uri =
    process.env.MONGODB_URI ||
    process.env.URL ||
    "mongodb://127.0.0.1:27017/sampark";

  mongoose.set("strictQuery", true);
  try {
    const connect = await mongoose.connect(uri);
    console.log(
      "✅  Database connected successfully:",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    console.error("❌  Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectedDb;
