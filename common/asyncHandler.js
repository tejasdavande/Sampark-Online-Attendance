/**
 * Wraps an async route handler so any rejected promise (or thrown error) is
 * forwarded to the central error handler via next(err) instead of crashing the
 * process or leaving the request hanging.
 */
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
