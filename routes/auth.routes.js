
const router = require("express").Router();
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const { isAuthenticated, isAdmin } = require("../middlewares/jwt.middleware");


function isGmailOrYahooEmail(email) {
  const gmailPattern = /@(gmail\.com|googlemail\.com)$/i;
  const yahooPattern = /@(yahoo\.com|yahoo\.co\.[a-z]{2})$/i;

  if (gmailPattern.test(email)) {
    return 'Gmail';
  } else if (yahooPattern.test(email)) {
    return 'Yahoo Mail';
  } else {
    return 'Other';
  }
}


router.get('/profile/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;

    
    const userProfile = await User.findById(userId);

    if (!userProfile) {
  
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.status(200).json({ user: userProfile });
  } catch (error) {
 
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


let userCount = 0;

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password, state, country } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Please provide email, username, and password" });
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }


    const emailType = isGmailOrYahooEmail(email);

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must have at least 6 characters and include at least one number, one lowercase letter, and one uppercase letter.",
      });
    }


    const foundUserDB = await User.findOne({ email });
    if (foundUserDB) {
      return res.status(400).json({ message: "User already exists" });
    }


    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const registerUser = await User.create({
      username,
      email,
      password: hashedPassword,
      state,
      country,
    });
    userCount++;

    res.status(201).json({ newUser: registerUser });

    // const newUser = {
    //   username,
    //   email,
    //   password: hashedPassword,
    //   state,
    //   country,
    // };

    // res.status(201).json({ newUser });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/user-count', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ userCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/get-user', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "username email");
    res.json({ users });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





router.put('/edit/profile/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { username, email, password, state, country } = req.body;

   
    const updatedUserData = { username, email, password, state, country };


    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error during profile update:', err);
    next(err);
  }
});




router.post("/login", (req, res, next) => {
  const { username, email, password } = req.body;


  if (!(email || username) || !password) {
    return res.status(400).json({ message: "Provide email or username and password" });
  }

  let check;
  if (email) {
    check = { email };
  } else {
    check = { username };
  }


  User.findOne(check)
    .then((foundUserDB) => {
      if (!foundUserDB) {
        res.status(401).json({
          message: "User not found",
        });
      }

    
      const correctPassword = bcrypt.compareSync(password, foundUserDB.password);

      if (correctPassword) {
     
        const { _id, username, email, state, country } = foundUserDB;
        const role = foundUserDB.role || "user";
        const payload = { _id, username, email, state, country, role};

    
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        res.status(200).json({ authToken: authToken, user: payload });
      } else {
        res.status(401).json({
          message: "Unable to authenticate the user",
        });
      }
    })
    .catch((err) => {
      console.error("Error during login:", err);
    });
});


router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});


router.get("/admin", isAuthenticated, isAdmin, (req, res) => {
  res.json({ message: "Admin authenticated successfully!" });
});

module.exports = router;
















// const router = require("express").Router();
// const User = require("../models/User.model");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const saltRounds = 10;
// const { isAuthenticated, isAdmin } = require("../middlewares/jwt.middleware");


// function isGmailOrYahooEmail(email) {
//   const gmailPattern = /@(gmail\.com|googlemail\.com)$/i;
//   const yahooPattern = /@(yahoo\.com|yahoo\.co\.[a-z]{2})$/i;

//   if (gmailPattern.test(email)) {
//     return 'Gmail';
//   } else if (yahooPattern.test(email)) {
//     return 'Yahoo Mail';
//   } else {
//     return 'Other';
//   }
// }


// router.get('/profile/:id', async (req, res, next) => {
//   try {
//     const userId = req.params.id;

    
//     const userProfile = await User.findById(userId);

//     if (!userProfile) {
  
//       return res.status(404).json({ error: 'User profile not found' });
//     }

//     res.status(200).json({ user: userProfile });
//   } catch (error) {
 
//     console.error('Error fetching user profile:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });




// router.post("/signup", async (req, res, next) => {
//   try {
//     const { username, email, password, state, country } = req.body;

  
//     if (!email || !password || !username) {
//       return res.status(400).json({ message: "Please provide email, username, and password" });
//     }

//     // Validate email format
//     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailPattern.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }


//     const emailType = isGmailOrYahooEmail(email);

//     const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         message: "Password must have at least 6 characters and include at least one number, one lowercase letter, and one uppercase letter.",
//       });
//     }


//     const foundUserDB = await User.findOne({ email });
//     if (foundUserDB) {
//       return res.status(400).json({ message: "User already exists" });
//     }


//     const salt = bcrypt.genSaltSync(saltRounds);
//     const hashedPassword = bcrypt.hashSync(password, salt);
//     const registerUser = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       state,
//       country,
//     });

//     const newUser = {
//       username,
//       email,
//       password: hashedPassword,
//       state,
//       country,
//     };

//     res.status(201).json({ newUser });
//   } catch (error) {
//     console.error("Error during user registration:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });



// router.put('/edit/profile/:id', async (req, res, next) => {
//   try {
//     const userId = req.params.id;
//     const { username, email, password, state, country } = req.body;

//     // Construct an object with the updated user profile fields
//     const updatedUserData = { username, email, password, state, country };


//     const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
//   } catch (err) {
//     console.error('Error during profile update:', err);
//     next(err);
//   }
// });




// router.post("/login", (req, res, next) => {
//   const { username, email, password } = req.body;


//   if (!(email || username) || !password) {
//     return res.status(400).json({ message: "Provide email or username and password" });
//   }

//   let check;
//   if (email) {
//     check = { email };
//   } else {
//     check = { username };
//   }


//   User.findOne(check)
//     .then((foundUserDB) => {
//       if (!foundUserDB) {
//         res.status(401).json({
//           message: "User not found",
//         });
//       }

    
//       const correctPassword = bcrypt.compareSync(password, foundUserDB.password);

//       if (correctPassword) {
     
//         const { _id, username, email, state, country } = foundUserDB;
//         const role = foundUserDB.role || "user";
//         const payload = { _id, username, email, state, country, role};

    
//         const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
//           algorithm: "HS256",
//           expiresIn: "6h",
//         });
//         res.status(200).json({ authToken: authToken });
//       } else {
//         res.status(401).json({
//           message: "Unable to authenticate the user",
//         });
//       }
//     })
//     .catch((err) => {
//       console.error("Error during login:", err);
//     });
// });


// router.get("/verify", isAuthenticated, (req, res, next) => {
//   res.status(200).json(req.payload);
// });


// router.get("/admin", isAuthenticated, isAdmin, (req, res) => {
//   res.json({ message: "Admin authenticated successfully!" });
// });

// module.exports = router;







