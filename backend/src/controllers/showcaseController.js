import db from "../db/db.js";

// GET /api/showcase?area=Kitchen
export const getContributions = async (req, res) => {
  try {
    const { area } = req.query;
    const params = [];
    let where = "";

    if (area && area !== "All") {
      where = "WHERE dc.area = $1";
      params.push(area);
    }

    const result = await db.query(
      `SELECT
        dc.id,
        dc.area,
        dc.furniture_type,
        dc.description,
        dc.preview_image_url,
        dc.configuration,
        dc.total_cost,
        dc.created_at,
        u.first_name,
        u.last_name,
        u.email
      FROM design_contributions dc
      LEFT JOIN users u ON u.id = dc.user_id
      ${where}
      ORDER BY dc.created_at DESC`,
      params
    );

    res.json({ contributions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch contributions" });
  }
};
