/**
 * Catches requests that matched no route, so the client gets JSON rather than
 * Express's default HTML error page.
 */
function notFound(req, res) {
  res
    .status(404)
    .json({ error: `No route for ${req.method} ${req.originalUrl}` });
}

export default notFound;
