const router = require("express").Router();
const Album = require("../models/Album.model");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middlewares/jwt.middleware");

router.get("/username/:username", isAuthenticated, async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: "Username is missing or invalid" });
    }

    console.log(req.headers);

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
});

router.get("/recently-added", isAuthenticated, async (req, res) => {
  try {
    const { _id } = req.payload;
    console.log("req", req);

    const user = await User.findById(_id).populate({
      path: "library",
      options: { sort: { date_added: -1 } },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const recentlyAddedAlbums = user.library;

    res.json({ recentlyAddedAlbums });
  } catch (error) {
    console.error("Error fetching recently added albums:", error);
    res.status(500).json({ error: "Error fetching recently added albums" });
  }
});

router.post("/add", isAuthenticated, async (req, res) => {
  try {
    const { userId, albumId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!albumId) {
      return res.status(400).json({ error: "Invalid album ID" });
    }

    user.library.push(albumId);
    await user.save();

    res.json({ message: "Album added to library successfully" });
  } catch (error) {
    console.error("Error adding album to library:", error);
    res.status(500).json({ error: "Error adding album to library" });
  }
});

router.post("/remove/:albumId", async (req, res) => {
  try {
    const albumId = req.params.albumId;
    console.log("req.payload!!!!!", req.payload);
    const _id = req.payload._id;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const albumIndex = user.library.indexOf(albumId);
    console.log("albumIndex", albumIndex);

    if (albumIndex === -1) {
      return res
        .status(404)
        .json({ error: "Album not found in user's library" });
    }

    user.library.splice(albumIndex, 1);
    await user.save();

    res
      .status(200)
      .json({ message: "Album removed from library successfully" });
  } catch (error) {
    console.error("Error removing album from library:", error);
    res.status(500).json({ error: "Error removing album from library" });
  }
});

module.exports = router;
