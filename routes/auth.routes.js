const router = require("express").Router();
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const {corsMiddleware, isAuthenticated, isAdmin } = require("../middlewares/jwt.middleware");

const countries = ["UK", "USA", "FRANCE", "NIGERIA", "OTHER"];
const states = {
  UK: ["London", "Manchester", "Birmingham"],
  USA: ["New York", "California", "Texas"],
  FRANCE: ["PARIS", "LYON", "SAINT TROPEZ"],
  CANADA: ["TORONTO", "¡QUEBE"],
  NIGERIA: ["Lagos", "Abuja"],
  OTHER: [],
};

router.get("/countries", (req, res) => {
  res.json(countries);
});

router.get("/states/:country", (req, res) => {
  const country = req.params.country.toUpperCase();
  if (!countries.includes(country)) {
    return res.status(400).json({ error: "Invalid country" });
  }
  const countryStates = states[country] || [];
  res.json(countryStates);
});

function isValidEmail(email) {
  return email.includes("@");
}

router.get("/profile/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;

    const userProfile = await User.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json({ user: userProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
let userCount = 0;

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password, state, country, consent, role } =
      req.body;

    if (!username) {
      return res
        .status(401)
        .json({ errorUsername: "Please enter a valid username" });
    }

    if (!email || !isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must have at least 6 characters and include at least one number, one lowercase letter, and one uppercase letter.",
      });
    }

    if (!state) {
      return res.status(401).json({ errorState: "Please select a state" });
    }

    if (!country) {
      return res.status(401).json({ errorCountry: "Please select a country" });
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
      consent,
    });

    const token = jwt.sign(
      {
        userId: registerUser._id,
        email: registerUser.email,
        username: registerUser.username,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      sameSite: "Strict", 
      secure: true, 
      path: "/", 
    });
    
    res
      .status(201)
      .json({ message: "User created successfully", user: registerUser });

    console.log("registerUser", registerUser);
    console.log("token", token);
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/user-count", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ userCount });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get-user", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "username email");
    res.json({ users });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/edit/profile/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { username, email, password, state, country } = req.body;

    const updatedUserData = { username, email, password, state, country };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error during profile update:", err);
    next(err);
  }
});

router.post("/login", (req, res, next) => {
  const { username, email, password } = req.body;

  if (!(email || username) || !password) {
    return res
      .status(400)
      .json({ message: "Provide email or username and password" });
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
        return res.status(401).json({
          message: "User not found",
        });
      }

      if (foundUserDB && foundUserDB.password) {
        const correctPassword = bcrypt.compareSync(
          password,
          foundUserDB.password
        );

        if (correctPassword) {
          const { _id, username, email, state, country } = foundUserDB;
          const role = foundUserDB.role || "user";
          const payload = { _id, username, email, state, country, role };

          const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "9h",
          });

          res.cookie("authToken", authToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            path: "/",
          });

          return res.status(200).json({ authToken: authToken, user: payload });
        } else {
          return res.status(401).json({
            message: "Authenticate Failed",
          });
        }
      } else {
        return res.status(401).json({
          message: "User password not found",
        });
      }
    })
    .catch((err) => {
      console.error("Error during login:", err);
      return res
        .status(500)
        .json({ message: "Error during login", error: err.message });
    });
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

router.get("/admin", isAdmin, (req, res) => {
  res.json({ message: "Admin authenticated successfully!" });
});

router.post("/update-consent", async (req, res) => {
  const { _id, consent } = req.body;
  console.log("show me consent id if there Req.body", req.body);

  console.log(
    "Received update consent request. User ID:",
    _id,
    "Consent:",
    consent
  );
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { consent },
      { new: true }
    );
    console.log("consent reponse", updatedUser);
    res.status(200).json({ message: "Consent updated successfully" });
  } catch (error) {
    console.error("Error updating consent:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
