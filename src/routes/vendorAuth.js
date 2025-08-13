import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm"; 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

// Vendor login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //  Correct where condition
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user.length || user[0].role !== "vendor") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // TODO: verify password hash here
    // Assuming password matches

    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, role: user[0].role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Vendor Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
