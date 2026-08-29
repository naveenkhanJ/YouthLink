/**
 * An error that is safe to show the client, carrying an HTTP status.
 *
 * Throw this for expected failures — validation, not-found, forbidden. Anything
 * else that reaches the error handler is treated as an unexpected bug and its
 * message is NOT sent to the client, so internal details can't leak.
 */
class AppError extends Error {
  /**
   * @param {number} status - HTTP status code.
   * @param {string} message - Message safe to return to the client.
   * @param {object} [fields] - Optional per-field errors, e.g. { phone: "Already registered" }.
   */
  constructor(status, message, fields) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.fields = fields;
    Error.captureStackTrace(this, AppError);
  }

  static badRequest(message, fields) {
    return new AppError(400, message, fields);
  }
  static unauthorized(message = "Authentication required") {
    return new AppError(401, message);
  }
  static forbidden(message = "Not permitted") {
    return new AppError(403, message);
  }
  static notFound(message = "Not found") {
    return new AppError(404, message);
  }
  static conflict(message, fields) {
    return new AppError(409, message, fields);
  }
}

export default AppError;
