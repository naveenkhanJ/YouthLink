/**
 * Wraps an async route handler so a rejected promise reaches Express's error
 * handler instead of hanging the request.
 *
 * Express 5 forwards rejected promises automatically, but wrapping is explicit
 * and keeps the intent obvious to anyone reading the routes file.
 *
 * Usage:
 *   router.post("/register", asyncHandler(controller.register));
 *
 * @param {Function} fn - async (req, res, next) => {}
 * @returns {Function}
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
