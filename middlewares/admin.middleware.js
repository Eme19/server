

// const jwt = require("jsonwebtoken");

// // Middleware to protect admin routes
// function adminAuthMiddleware(req, res, next) {
//   // Check if a valid admin JWT token is present in the request
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "Access denied, no token provided" });
//   }

//   try {
//     // Verify the token and decode its payload
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

//     // Check if the decoded payload has the admin role
//     if (decoded.role !== "admin") {
//       return res.status(403).json({ error: "Access denied, not an admin" });
//     }

//     // Admin is authenticated, proceed to the next middleware or route
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// }

// module.exports = adminAuthMiddleware;

  