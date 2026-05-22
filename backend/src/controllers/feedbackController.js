import db from "../db/db.js";

// get all feedbacks
export const getFeedbacks = async (req, res) => {
  try {
    // count how many more than 4 stars rating feedbacks
    const countResult = await db.query(
      "SELECT COUNT(*) FROM feedback WHERE rating >= 4"
    );
    const totalSatisfied = parseInt(countResult.rows[0].count);

    const reviewsResult = await db.query(`
    SELECT
        f.id,
        f.rating,
        f.comment,
        CONCAT(u.first_name, ' ', u.last_name) AS user
    FROM feedback f
    LEFT JOIN users u ON f.user_id = u.id
    WHERE f.rating >= 4
    ORDER BY RANDOM()
    LIMIT 4
    `)

    res.status(200).json({
      totalSatisfied,
      reviews: reviewsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch feedbacks",
    });
  }
};

// create feedback
export const createFeedback = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // split name into first + last
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    // create temporary guest user
    const userResult = await db.query(
      `
      INSERT INTO users
      (
        first_name,
        last_name,
        email,
        password_hash
      )
      VALUES ($1,$2,$3,$4)
      RETURNING id
      `,
      [
        firstName,
        lastName,
        `guest_${Date.now()}@guest.com`,
        "guest",
      ]
    );

    const userId = userResult.rows[0].id;

    // insert feedback
    const feedbackResult = await db.query(
      `
      INSERT INTO feedback
      (
        user_id,
        rating,
        comment
      )
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [userId, rating, comment]
    );

    res.status(201).json(feedbackResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to submit feedback",
    });
  }
};