/**
 * Discovery & Search controllers — the HTTP layer.
 *
 * Epic: FR-DISC  ·  Owner: Pawan
 */
import service from "./discovery.service.js";
import saved from "./discovery.saved.js";

/** A query-string number, or undefined when it is missing or not a number. */
function numberParam(value) {
  if (value == null || value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export default {
  // GET /api/discovery?lat=&lng= | ?area=  [&category=&arrangementType=&keyword=&sortBy=&expand=false]
  async browse(req, res) {
    const { area, category, arrangementType, keyword, sortBy } = req.query;

    const results = await service.browseGigs({
      browser: req.user,
      lat: numberParam(req.query.lat),
      lng: numberParam(req.query.lng),
      area,
      category: category || undefined,
      arrangementType: arrangementType || undefined,
      keyword,
      sortBy: sortBy || undefined,
      // NFR-PERF-03: ?expand=false stops the radius auto-expansion (the app's 10-second "stop").
      expand: req.query.expand !== "false",
    });

    res.json(results);
  },

  // GET /api/discovery/saved — FR-DISC-06
  async listSaved(req, res) {
    res.json({ postings: await saved.listSaved({ userId: req.user.id }) });
  },

  // GET /api/discovery/saved/:gigPostingId — { saved }
  async isSaved(req, res) {
    res.json(await saved.isSaved({ userId: req.user.id, gigPostingId: req.params.gigPostingId }));
  },

  // PUT /api/discovery/saved/:gigPostingId — bookmark
  async saveGig(req, res) {
    res.json(await saved.saveGig({ userId: req.user.id, gigPostingId: req.params.gigPostingId }));
  },

  // DELETE /api/discovery/saved/:gigPostingId — remove the bookmark
  async unsaveGig(req, res) {
    res.json(await saved.unsaveGig({ userId: req.user.id, gigPostingId: req.params.gigPostingId }));
  },
};
