
const { expressjwt: jwt } = require("express-jwt");
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


function isAdmin(req, res, next) {
  const { payload } = req;

  
  if (payload && payload.role === "admin") {
    next();
  } else {
  
    return res.status(403).json({ error: "Access denied, not an admin" });
  }
}

module.exports = {
  isAuthenticated,
  isAdmin
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