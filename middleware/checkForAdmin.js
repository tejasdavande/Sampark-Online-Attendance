const jwt = require("jsonwebtoken");
require("dotenv").config();

const ALLOWED_ROLES = ["admin", "sabhaleader", "sevak"];

/**
 * Verifies the Bearer JWT AND that the user holds a privileged role.
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

    if (req.user && ALLOWED_ROLES.includes(req.user.user_type)) {
      return next();
    }
    return res.status(403).json({ message: "Access is not allowed" });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
