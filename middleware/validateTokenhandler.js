const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Verifies the Bearer JWT and attaches the decoded user to req.user.
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Please provide a valid token to access this" });
  }

  try {
    const decoded = jwt.verify(token, process.env.PRIVATEKEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "You must login to access this resource" });
  }
};
