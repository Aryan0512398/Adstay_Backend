import express from "express";
import { db } from "../db.js";
import { bookings } from "../schema.js";
import { eq } from "drizzle-orm";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// Create booking (authenticated)
router.post("/", authenticate, async (req, res) => {
  try {
    const { vendor_id, type, booking_date } = req.body;
    const user_id = req.user.id; //  from JWT payload

    const result = await db
      .insert(bookings)
      .values({
        user_id,
        vendor_id,
        type,
        booking_date: new Date(booking_date), //  ensure Date object
        status: "pending",
        payment_status: "pending",
      })
      .returning();

    res.status(201).json({ message: "Booking created", booking: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings for logged-in user
router.get("/my", authenticate, async (req, res) => {
  try {
    const user_id = req.user.id;

    const userBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.user_id, user_id)); 

    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
