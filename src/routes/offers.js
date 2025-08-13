import express from "express";
import { db } from "../db.js";
import { offers, vendors } from "../schema.js";
import { eq } from "drizzle-orm";
import { authenticateVendor } from "../middlewares/authVendor.js"; 

const router = express.Router();

// Create offer (vendor only)
router.post("/", authenticateVendor, async (req, res) => {
  try {
    const { code, discount_percentage, valid_from, valid_to } = req.body;

    // Get vendor profile for logged-in user
    const vendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.user_id, req.user.id));

    if (!vendor.length) {
      return res.status(400).json({ message: "Vendor profile not found" });
    }

    const newOffer = await db
      .insert(offers)
      .values({
        vendor_id: vendor[0].id, //  set vendor_id from logged-in user
        code,
        discount_percentage,
        valid_from: new Date(valid_from),
        valid_to: new Date(valid_to),
      })
      .returning();

    res.status(201).json({ message: "Offer created", offer: newOffer[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all offers
router.get("/", async (req, res) => {
  try {
    const allOffers = await db.select().from(offers);
    res.json(allOffers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get offers by vendor
router.get("/vendor/:vendor_id", async (req, res) => {
  try {
    const { vendor_id } = req.params;
    const vendorOffers = await db.select().from(offers).where(eq(offers.vendor_id, Number(vendor_id)));
    res.json(vendorOffers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update offer (vendor only)
router.patch("/:id", authenticateVendor, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount_percentage, valid_from, valid_to } = req.body;
    const vendor_id = req.user.id;

    // Check ownership
    const offer = await db.select().from(offers).where(eq(offers.id, Number(id)));
    if (!offer.length) return res.status(404).json({ message: "Offer not found" });
    if (offer[0].vendor_id !== vendor_id) return res.status(403).json({ message: "Unauthorized" });

    const updated = await db.update(offers)
      .set({
        code: code || offer[0].code,
        discount_percentage: discount_percentage || offer[0].discount_percentage,
        valid_from: valid_from ? new Date(valid_from) : offer[0].valid_from,
        valid_to: valid_to ? new Date(valid_to) : offer[0].valid_to,
      })
      .where(eq(offers.id, Number(id)))
      .returning();

    res.json({ message: "Offer updated", offer: updated[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete offer (vendor only)
router.delete("/:id", authenticateVendor, async (req, res) => {
  try {
    const { id } = req.params;
    const vendor_id = req.user.id;

    // Check ownership
    const offer = await db.select().from(offers).where(eq(offers.id, Number(id)));
    if (!offer.length) return res.status(404).json({ message: "Offer not found" });
    if (offer[0].vendor_id !== vendor_id) return res.status(403).json({ message: "Unauthorized" });

    await db.delete(offers).where(eq(offers.id, Number(id)));
    res.json({ message: "Offer deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
