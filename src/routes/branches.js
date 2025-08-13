import express from "express";
import { db } from "../db.js";
import { branches } from "../schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

// Create branch
router.post("/", async (req, res) => {
  try {
    const { name, city_id, contact_info } = req.body;
    if (!name || !city_id) {
      return res.status(400).json({ message: "Name and city_id are required" });
    }

    const result = await db.insert(branches).values({ name, city_id, contact_info }).returning();
    res.status(201).json({ message: "Branch created", branch: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all branches
router.get("/", async (req, res) => {
  try {
    const allBranches = await db.select().from(branches);
    res.json(allBranches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get branch by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await db.select().from(branches).where(eq(branches.id, Number(id)));

    if (!branch.length) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json(branch[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update branch
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city_id, contact_info } = req.body;

    const updated = await db
      .update(branches)
      .set({ name, city_id, contact_info })
      .where(eq(branches.id, Number(id)))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json({ message: "Branch updated", branch: updated[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
