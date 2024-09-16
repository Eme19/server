
const { expressjwt: jwt } = require("express-jwt");

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: 'payload',
  getToken: getTokenFromHeaders
});

function getTokenFromHeaders(req) {
 
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }
  return null;
}

// Middleware to check if the user has the "admin" role
function isAdmin(req, res, next) {
  const { payload } = req;

  // Check if the payload contains a "role" property with the value "admin"
  if (payload && payload.role === "admin") {
    next(); // User has admin role, proceed to the next middleware or route
  } else {
    // User does not have the admin role, return a 403 (Forbidden) response
    return res.status(403).json({ error: "Access denied, not an admin" });
  }
}

module.exports = {
  isAuthenticated,
  isAdmin // Export isAdmin middleware as well
};









// const {expressjwt: jwt} = require("express-jwt");

// // Instantiate the JWT token validation middleware
// const isAuthenticated = jwt({
//     secret: process.env.TOKEN_SECRET,
//   algorithms: ["HS256"],
//   requestProperty: 'payload' , 
// //   requestProperty: 'user',
//   getToken: getTokenFromHeaders
// });




// function getTokenFromHeaders (req){
//     if ((req).headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
//         const token = req.headers.authorization.split(" ")[1];
//         return token;
        
//     }
//     return null;
// }

// module.exports = {
//     isAuthenticated
// }