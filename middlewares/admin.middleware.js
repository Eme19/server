const jwt = require("jsonwebtoken");

function adminAuthMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied, not an admin" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = adminAuthMiddleware;
