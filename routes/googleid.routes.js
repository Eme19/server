const router = require("express").Router();
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

const { isAuthenticated, isAdmin } = require("../middlewares/jwt.middleware");

// Google Auth
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_ID = new OAuth2Client(GOOGLE_CLIENT_ID);

function generateAuthToken(user) {
  const jwtToken = jwt.sign(
    {
      _id: user._id,
      name: user.username,
      email: user.email,
      picture: user.picture,

    },
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  return jwtToken;
}

router.post("/google/login", async (req, res) => {
  let token = req.body.token;
  console.log("token",token)
  try {
    const ticket = await CLIENT_ID.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userId = payload["sub"];

    let user = await User.findOne({ googleId: userId });

    if (!user) {
      user = new User({
        googleId: userId,
        username: payload.name,
        email: payload.email,
        picture: payload.picture,
      });

      await user.save();
    }
    console.log("user",user)
    
    const authToken = generateAuthToken(user);
console.log("authToken",authToken)
  
    res.json({ success: true, message: "Login successful", authToken });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

module.exports = router;

















// const router = require("express").Router();
// const User = require("../models/User.model");
// const jwt = require("jsonwebtoken");

// const { isAuthenticated, isAdmin } = require("../middlewares/jwt.middleware");


// // Google Auth
// const { OAuth2Client } = require("google-auth-library");
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const CLIENT_ID = new OAuth2Client(GOOGLE_CLIENT_ID);

// router.post("/google/login", async (req, res) => {
//   let token = req.body.token;

//   try {
//     const ticket = await CLIENT_ID.verifyIdToken({
//       idToken: token,
//       audience: GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const userId = payload["sub"];

    
//     let user = await User.findOne({ googleId: userId });

//     if (!user) {
 
//       user = new User({
//         googleId: userId,
//         username: payload.name,
//         email: payload.email,
        
//       });
      
//       await user.save();
//     }


//     const authToken = generateAuthToken(user);
//     console.log("what inside google jwt token", authToken )
//     res.json({ success: true, message: "Login successful", authToken });
//   } catch (error) {
//     console.error("Error during Google login:", error);
//     res.status(500).json({ success: false, message: "Login failed" });
//   }
// });

// function generateAuthToken(user) {
//   const jwtToken = jwt.sign(
//     {
//       _id: user._id,
//       name: user.username, 
//       email: user.email,
      
//     },
   
//     process.env.TOKEN_SECRET, 
//     { expiresIn: "1h" }
//   );
 
//   return jwtToken;
// }

// module.exports = router;
