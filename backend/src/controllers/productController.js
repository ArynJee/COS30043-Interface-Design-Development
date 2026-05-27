import db from "../db/db.js";

// GET /api/products?page=1&limit=12&sort=default&category_ids=1,2&tag_ids=3
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category_ids = "",
      tag_ids = "",
      sort = "default",
      search = "",
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];
    let idx = 1;

    if (category_ids) {
      const ids = category_ids.split(",").map(Number).filter((n) => !isNaN(n) && n > 0);
      if (ids.length > 0) {
        conditions.push(`p.category_id = ANY($${idx++}::int[])`);
        params.push(ids);
      }
    }

    if (tag_ids) {
      const ids = tag_ids.split(",").map(Number).filter((n) => !isNaN(n) && n > 0);
      if (ids.length > 0) {
        conditions.push(`p.tag_id = ANY($${idx++}::int[])`);
        params.push(ids);
      }
    }

    if (search.trim()) {
      conditions.push(`p.name ILIKE $${idx++}`);
      params.push(`%${search.trim()}%`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const orderMap = {
      price_asc: "p.base_price ASC",
      price_desc: "p.base_price DESC",
      most_sold: "p.sold_count DESC",
    };
    const order = `ORDER BY ${orderMap[sort] ?? "p.id ASC"}`;

    const countRes = await db.query(
      `SELECT COUNT(*) FROM products p ${where}`,
      params
    );
    const total = parseInt(countRes.rows[0].count);

    const productsRes = await db.query(
      `SELECT
        p.id,
        p.name,
        p.base_price,
        p.sold_count,
        p.stock_count,
        p.width_cm,
        p.height_cm,
        p.depth_cm,
        c.id   AS category_id,
        c.name AS category,
        pt.id  AS tag_id,
        pt.name AS tag,
        ARRAY_AGG(pi.image_url ORDER BY pi.display_order) AS images
      FROM products p
      LEFT JOIN categories c    ON c.id  = p.category_id
      LEFT JOIN product_tags pt ON pt.id = p.tag_id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      ${where}
      GROUP BY p.id, c.id, c.name, pt.id, pt.name
      ${order}
      LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, parseInt(limit), offset]
    );

    res.status(200).json({
      products: productsRes.rows,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// GET /api/products/filters
export const getFilters = async (req, res) => {
  try {
    const categoriesRes = await db.query(
      `SELECT id, name FROM categories ORDER BY name`
    );
    const tagsRes = await db.query(
      `SELECT id, name, category_id FROM product_tags ORDER BY category_id, name`
    );

    res.status(200).json({
      categories: categoriesRes.rows,
      tags: tagsRes.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch filters" });
  }
};
