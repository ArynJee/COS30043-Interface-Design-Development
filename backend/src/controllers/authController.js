import db from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existing = await db.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (first_name, last_name, email, phone_number, address, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, first_name, last_name, email, phone_number, address, created_at`,
      [
        firstName,
        lastName,
        email,
        phone || null,
        address || null,
        passwordHash,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: user.phone_number,
        address: user.address,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, first_name, last_name, email, phone_number, address, created_at, updated_at
       FROM users WHERE id = $1`,
      [req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// PATCH /api/auth/me
export const updateMe = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const fields = [];
    const values = [];
    let i = 1;

    if (firstName !== undefined) {
      fields.push(`first_name = $${i++}`);
      values.push(firstName);
    }
    if (lastName !== undefined) {
      fields.push(`last_name = $${i++}`);
      values.push(lastName);
    }
    if (phone !== undefined) {
      fields.push(`phone_number = $${i++}`);
      values.push(phone);
    }
    if (address !== undefined) {
      fields.push(`address = $${i++}`);
      values.push(address);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.userId);

    const result = await db.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${i}
       RETURNING id, first_name, last_name, email, phone_number, address, updated_at`,
      values,
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// DELETE /api/auth/me
export const deleteMe = async (req, res) => {
  try {
    await db.query("DELETE FROM otp_requests WHERE user_id = $1", [req.userId]);
    await db.query("DELETE FROM feedback WHERE user_id = $1", [req.userId]);
    await db.query("DELETE FROM users WHERE id = $1", [req.userId]);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete account" });
  }
};
