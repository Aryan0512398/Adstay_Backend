import express from "express";
import { db } from "../db.js";
import { vendors } from "../schema.js";
import { eq } from "drizzle-orm";
import { authenticate } from "../middlewares/auth.js"; 

const router = express.Router();

/**
 *  POST /vendors
 *  Create vendor profile (Authenticated user)
 */
router.post("/", authenticate, async (req, res) => {
  try {
    const { business_type, documents } = req.body;
    const user_id = req.user.id; 

    // Check if vendor already exists for this user
    const existingVendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.user_id, user_id));

    if (existingVendor.length) {
      return res.status(400).json({ message: "Vendor profile already exists" });
    }

    const result = await db
      .insert(vendors)
      .values({
        user_id,
        business_type,
        documents, 
      })
      .returning();

    res
      .status(201)
      .json({ message: "Vendor profile created", vendor: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 *  GET /vendors
 * Get all vendors
 */
router.get("/", async (req, res) => {
  try {
    const allVendors = await db.select().from(vendors);
    res.json(allVendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 *  GET /vendors/user/:user_id
 *Get vendor by user_id
 */
router.get("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const vendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.user_id, Number(user_id)));

    if (!vendor.length) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(vendor[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 Get vendor by vendor_id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.id, Number(id)));

    if (!vendor.length) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(vendor[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 Update vendor profile (only owner)
 */
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { business_type, documents } = req.body;
    const user_id = req.user.id;

    // Check vendor ownership
    const vendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.id, Number(id)));

    if (!vendor.length) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    if (vendor[0].user_id !== user_id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this vendor" });
    }

    const updated = await db
      .update(vendors)
      .set({ business_type, documents })
      .where(eq(vendors.id, Number(id)))
      .returning();

    res.json({ message: "Vendor updated", vendor: updated[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
