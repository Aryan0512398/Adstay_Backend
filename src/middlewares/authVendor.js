import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export const authenticateVendor = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "vendor") {
      return res.status(403).json({ message: "Access denied: Vendor only" });
    }
    req.user = decoded; // Add decoded payload to request
    console.log("Auth Vendor is done successfully")
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
