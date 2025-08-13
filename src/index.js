import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js"; 
import vendorRoutes from "./routes/vendor.js"; 
import bookingRoutes from "./routes/booking.js"; 
import paymentRoutes from "./routes/payment.js"; 
import reviewsRoutes from "./routes/reviews.js"; 
import offersRoutes from "./routes/offers.js"; 
import branchesRoutes from "./routes/branches.js"; 
import locationsRoutes from "./routes/locations.js"; 
import complaintsRoutes from "./routes/complaints.js"; 
import vendorAuthRoutes from "./routes/vendorAuth.js"; 

dotenv.config();

const app = express();
app.use(express.json());

//  Use the  routes
app.use("/users", userRoutes);
app.use("/vendors", vendorRoutes);
app.use("/vendor", vendorAuthRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payments", paymentRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/offers", offersRoutes);
app.use("/branches", branchesRoutes);
app.use("/locations", locationsRoutes);
app.use("/complaints", complaintsRoutes);

app.get("/", (req, res) => {
  res.send(" Server is running with Drizzle + Neon");
});

app.listen(process.env.PORT, () => {
  console.log(` Server running on http://localhost:${process.env.PORT}`);
});
