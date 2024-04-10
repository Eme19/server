const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const User = require("../models/User.model");

// const configureCors = require('./corsMiddleware');

// router.use(configureCors());

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post(
  "/upload",
  fileUploader.single("image"),
  isAuthenticated,
  (req, res, next) => {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }

    res.json({ image: req.file.path });
  }
);

router.get("/users", (req, res) => {
  const userId = req.payload._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const userWithImage = {
        _id: user._id,
        username: user.username,
        email: user.email,
        state: user.state,
        country: user.country,
        image: user.image,
      };

      res.status(200).json(userWithImage);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error fetching user data" });
    });
});

router.put("/users", isAuthenticated, (req, res) => {
  const { _id, image } = req.body;

  User.findByIdAndUpdate(_id, { image }, { new: true })
    .then((updatedUser) => {
      res.json({ updatedUser });
    })
    .catch((err) => console.error(err));
});

router.delete("/users/:username/image", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.image = null;
    await user.save();
    res.status(200).json({ message: "Profile image deleted successfully" });
  } catch (error) {
    console.error("Error deleting user imag:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
