import express from "express";
import { db } from "../db.js";
import { reviews } from "../schema.js"; 
import { eq } from "drizzle-orm";

const router = express.Router();

//  Create a review
router.post("/", async (req, res) => {
  try {
    const { user_id, vendor_id, rating, comment } = req.body;

    if (!user_id || !vendor_id || !rating) {
      return res.status(400).json({ error: "user_id, vendor_id, and rating are required" });
    }

    const result = await db.insert(reviews).values({
      user_id,
      vendor_id,
      rating,
      comment,
    }).returning();

    res.status(201).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create review" });
  }
});

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const result = await db.select().from(reviews);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

//  Update a review
router.patch("/:id", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const result = await db
      .update(reviews)
      .set({ rating, comment })
      .where(eq(reviews.id, req.params.id))
      .returning();

    if (!result.length) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update review" });
  }
});

//  Delete a review
router.delete("/:id", async (req, res) => {
  try {
    const result = await db
      .delete(reviews)
      .where(eq(reviews.id, req.params.id))
      .returning();

    if (!result.length) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

export default router;
