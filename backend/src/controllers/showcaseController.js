import db from "../db/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function saveBase64Image(base64Data) {
  if (!base64Data) return null;
  const data = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const filename = `showcase_${Date.now()}_${Math.random().toString(36).slice(2, 9)}.png`;
  const filepath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(filepath, Buffer.from(data, "base64"));
  return `/uploads/${filename}`;
}

// POST /api/showcase  — submit a custom design contribution
export const createContribution = async (req, res) => {
  try {
    const { area, furniture_type, description, configuration, total_cost, preview_image } = req.body;
    if (!area || !furniture_type) {
      return res.status(400).json({ message: "area and furniture_type are required" });
    }

    const imageUrl = saveBase64Image(preview_image);

    const result = await db.query(
      `INSERT INTO design_contributions (user_id, area, furniture_type, description, preview_image_url, configuration, total_cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, area, furniture_type, description, preview_image_url, total_cost, created_at`,
      [
        req.userId,
        area,
        furniture_type,
        description || "",
        imageUrl,
        JSON.stringify(configuration || {}),
        total_cost || 0,
      ]
    );

    res.status(201).json({ contribution: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit contribution" });
  }
};

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
