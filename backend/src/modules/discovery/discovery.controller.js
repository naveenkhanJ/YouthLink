/**
 * Discovery & Search controllers — the HTTP layer.
 *
 * Epic: FR-DISC  ·  Owner: Pawan
 */
import service from "./discovery.service.js";

export default {
  async browse(req, res) {
    const {
      lat,
      lng,
      radius,
      category,
      arrangementType,
      keyword,
      sortBy,
      autoExpand,
    } = req.query;

    const results = await service.browseGigs({
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      radius: radius ? parseFloat(radius) : undefined,
      category,
      arrangementType,
      keyword,
      sortBy,
      autoExpand: autoExpand !== "false",
    });

    res.json(results);
  },
};
