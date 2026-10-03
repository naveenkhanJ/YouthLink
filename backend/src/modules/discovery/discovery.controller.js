/**
 * Discovery & Search controllers — the HTTP layer.
 *
 * Epic: FR-DISC  ·  Owner: Pawan
 */
import service from "./discovery.service.js";

/** A query-string number, or undefined when it is missing or not a number. */
function numberParam(value) {
  if (value == null || value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export default {
  // GET /api/discovery?lat=&lng= | ?area=  [&category=&arrangementType=&keyword=&sortBy=]
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
    });

    res.json(results);
  },
};
