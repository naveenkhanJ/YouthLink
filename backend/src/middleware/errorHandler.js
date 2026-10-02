/**
 * Central error handler. Must be registered LAST in app.js, after all routes.
 *
 * Express identifies an error handler by its four arguments — do not remove
 * `next` even though it is unused, or Express treats this as normal middleware
 * and errors fall through unhandled.
 */
import AppError from "../utils/AppError.js";

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Expected, client-safe failures.
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
      ...(err.fields ? { fields: err.fields } : {}),
      ...(err.code ? { code: err.code } : {}),
    });
  }

  // Client errors raised by Express itself, e.g. body-parser's malformed JSON
  // (400, type "entity.parse.failed") or an oversized body (413). They carry a
  // 4xx `status` and are flagged `expose`, meaning their message is safe to
  // show. Without this they fell through to the 500 branch below, which told
  // the client "Something went wrong" for a mistake that was the client's.
  if (err.expose && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({
      error:
        err.type === "entity.parse.failed"
          ? "The request body is not valid JSON."
          : err.message,
    });
  }

  // Prisma's unique-constraint violation. Surfaces as a 409 rather than a 500,
  // because it means the client sent a value that already exists.
  if (err.code === "P2002") {
    return res.status(409).json({ error: "That value is already in use" });
  }

  // Anything else is a bug. Log it in full, tell the client nothing.
  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Something went wrong" });
}

export default errorHandler;
