import express from "express";
import { db } from "../db.js";
import { complaints } from "../schema.js";
import { eq } from "drizzle-orm";
import { authenticate } from "../middlewares/auth.js"; 

const router = express.Router();

// Create complaint (authenticated user)
router.post("/", authenticate, async (req, res) => {
  try {
    const { vendor_id, complaint_text, escalated_to } = req.body;
    const raised_by_user_id = req.user.id;

    if (!complaint_text) {
      return res.status(400).json({ message: "Complaint text is required" });
    }

    const result = await db.insert(complaints).values({
      raised_by_user_id,
      vendor_id: vendor_id || null,
      complaint_text,
      status: "open",
      escalated_to: escalated_to || null,
    }).returning();

    res.status(201).json({ message: "Complaint created", complaint: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all complaints 
router.get("/", async (req, res) => {
  try {
    const { user_id, vendor_id } = req.query;

    let query = db.select().from(complaints);

    if (user_id) query = query.where(eq(complaints.raised_by_user_id, Number(user_id)));
    if (vendor_id) query = query.where(eq(complaints.vendor_id, Number(vendor_id)));

    const allComplaints = await query;
    res.json(allComplaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update complaint status (e.g., resolve or escalate)
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, escalated_to } = req.body;

    const updated = await db
      .update(complaints)
      .set({
        status: status || undefined,
        escalated_to: escalated_to || undefined,
        updated_at: new Date(),
      })
      .where(eq(complaints.id, Number(id)))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint updated", complaint: updated[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
