import express from "express";
import { db } from "../db.js";
import { payments, bookings } from "../schema.js";
import { eq } from "drizzle-orm";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

//Create a payment for a booking
router.post("/", authenticate, async (req, res) => {
  try {
    const { booking_id, amount, method } = req.body;

    //  Check if booking exists and belongs to this user
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, booking_id));

    if (!booking.length) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (booking[0].user_id !== req.user.id) {
      return res.status(403).json({ error: "You cannot pay for this booking" });
    }

    //  Create payment entry
    const newPayment = await db
      .insert(payments)
      .values({
        booking_id,
        user_id: req.user.id,
        amount,
        method,
        status: "pending",
      })
      .returning();

    res.status(201).json({ message: "Payment initiated", payment: newPayment[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my payments
router.get("/my", authenticate, async (req, res) => {
  try {
    const myPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.user_id, req.user.id));

    res.json(myPayments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update payment status (simulate gateway callback)
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const { status, transaction_id } = req.body;

    // 1️ Update payment
    const updatedPayment = await db
      .update(payments)
      .set({ status, transaction_id })
      .where(eq(payments.id, req.params.id))
      .returning();

    if (!updatedPayment.length) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // If payment successful, mark booking as paid
    if (status.toLowerCase() === "success" || status.toLowerCase() === "paid") {
      await db
        .update(bookings)
        .set({ payment_status: "paid" })
        .where(eq(bookings.id, updatedPayment[0].booking_id));
    }

    res.json({ message: "Payment updated", payment: updatedPayment[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
