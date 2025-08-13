import express from "express";
import { db } from "../db.js";
import { users } from "../schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

// Register (Create user with hashed password)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const result = await db.insert(users).values({ name, email, password_hash, role }).returning();
    res.status(201).json({ message: "User registered successfully", user: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login - generate JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await db.select().from(users).where(eq(users.email, email));
    if (!user.length) return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const validPassword = await bcrypt.compare(password, user[0].password_hash);
    if (!validPassword) return res.status(400).json({ message: "Invalid email or password" });

    // Create JWT token
    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, role: user[0].role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected route example
router.get("/profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.select().from(users).where(eq(users.id, decoded.id));
    if (!user.length) return res.status(404).json({ message: "User not found" });
    res.json({ user: user[0] });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default router;
