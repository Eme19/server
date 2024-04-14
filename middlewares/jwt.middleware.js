// const jwt = require("jsonwebtoken");

// const isAuthenticated = (req, res, next) => {
//   const authToken = req.cookies.authToken;

//   if (authToken) {
//     jwt.verify(authToken, process.env.TOKEN_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: "Unauthorized" });
//       } else {
//         req.payload = decoded;
//         next();
//       }
//     });
//   } else {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };

// const isAdmin = (req, res, next) => {
//   const { payload } = req;

//   if (payload && payload.role === "admin") {
//     next();
//   } else {
//     return res.status(403).json({ error: "Access denied, not an admin" });
//   }
// };

// module.exports = {
//   isAuthenticated,
//   isAdmin,
// };









const jwt = require("jsonwebtoken");
const cors = require("cors");

const isAuthenticated = (req, res, next) => {
  const authToken = req.cookies.authToken;

  if (authToken) {
    jwt.verify(authToken, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        req.payload = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const isAdmin = (req, res, next) => {
  const { payload } = req;

  if (payload && payload.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "Access denied, not an admin" });
  }
};


const corsOptions = {
  origin: "https://u-play.vercel.app", 
  credentials: true, 
};
const corsMiddleware = cors(corsOptions);

module.exports = {
  isAuthenticated,
  isAdmin,
  corsMiddleware, 
};
