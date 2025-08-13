import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; // attach decoded payload (e.g., { id, email })
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
