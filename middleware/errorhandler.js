const { constants } = require("../constants");

/**
 * Central error handler. Controllers signal failures by calling
 * res.status(<code>) and then throwing an Error; the asyncHandler forwards it
 * here. We map the status code to a title and return a consistent JSON body.
 * Stack traces are only included outside production.
 */
const TITLES = {
  [constants.VALIDATION_ERROR]: "Validation Failed",
  [constants.UNAUTHORIZED]: "Unauthorized",
  [constants.FORBIDDEN]: "Forbidden",
  [constants.NOT_FOUND]: "Not Found",
  [constants.SERVER_ERROR]: "Server Error",
};

const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : constants.SERVER_ERROR;

  res.status(statusCode).json({
    title: TITLES[statusCode] || "Error",
    message: err.message || "Something went wrong",
    stackTrace: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = errorHandler;
