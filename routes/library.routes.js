
const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const session = require("express-session");


const { isAuthenticated } = require("../middlewares/jwt.middleware");


router.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key", 
  resave: false,
  saveUninitialized: true
}));



router.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  next();
});



 router.get("/recently-added/album", isAuthenticated, async (req, res) => {
   try {
     const { _id } = req.payload;
     const user = await User.findById(_id).populate({
       path: "library",
       options: { sort: { date_added: -1 } },
       populate: { path: "artist" }
     });

     if (!user) {
       return res.status(404).json({ error: "User not found" });
     }
     const recentlyAddedAlbums = user.library;
     res.json({ recentlyAddedAlbums, artists: user.artists });
   } catch (error) {
     console.error("Error fetching recently added albums:", error);
     res.status(500).json({ error: "Error fetching recently added albums" });
   }
 });



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



router.get("/recently-added/tracks", isAuthenticated, async (req, res) => {
  try {
    const { _id } = req.payload;
    const user = await User.findById(_id).populate({
      path: "library",
      options: { sort: { date_added: -1 } },

    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const recentlyAddedTracks = user.library;

    res.json({ recentlyAddedTracks });
  } catch (error) {
    console.error("Error fetching recently added tracks:", error);
    res.status(500).json({ error: "Error fetching recently added tracks" });
  }
});

router.post("/add/tracks", isAuthenticated, async (req, res) => {
  try {
    const { userId, trackId } = req.body;

 
    if (!userId || !trackId) {
      return res.status(400).json({ error: "User ID or Track ID is missing" });
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

   
    if (user.library.includes(trackId)) {
      return res.status(400).json({ error: "Track already in library" });
    }

  
    user.library.push(trackId);
    await user.save();


    res.json({ message: "Track added to library successfully" });
  } catch (error) {
    console.error("Error adding track to library:", error);
    res.status(500).json({ error: "Error adding track to library" });
  }
});

router.post("/add", isAuthenticated, async (req, res) => {
  try {
    const { userId, albumId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!albumId) {
      return res.status(400).json({ error: "Invalid album ID" });
    }
    if (user.library.includes(albumId)) {
      return res.status(400).json({ error: "Album already in library" });
    }
    user.library.push(albumId);
    await user.save();

    req.session.userId = user._id;
    req.user = user;
    res.json({ message: "Album added to library successfully" });
  } catch (error) {
    console.error("Error adding album to library:", error);
    res.status(500).json({ error: "Error adding album to library" });
  }
});



router.post("/remove/:trackId", isAuthenticated, async (req, res) => {
  try {
    const trackId = req.params.trackId;
    const user = req.user;
    const trackIndex = user.library.indexOf(trackId);
    if (trackIndex === -1) {
      return res.status(404).json({ error: "Track not found in user's library" });
    }
    user.library.splice(trackIndex, 1);
    await user.save();

    req.session.userId = user._id;
    req.user = user;
    res.status(200).json({ message: "Track removed from library successfully" });
  } catch (error) {
    console.error("Error removing track from library:", error);
    res.status(500).json({ error: "Error removing track from library" });
  }
});



router.delete("/remove/:albumId", isAuthenticated, async (req, res) => {
  try {
    const albumId = req.params.albumId;
    const _id = req.payload._id;


    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const albumIndex = user.library.indexOf(albumId);
    if (albumIndex === -1) {
      return res.status(404).json({ error: "Album not found in user's library" });
    }

 
    user.library.splice(albumIndex, 1);

   
    await user.save();

    res.status(200).json({ message: "Album removed from library successfully" });
  } catch (error) {
    console.error("Error removing album from library:", error);
    res.status(500).json({ error: "Error removing album from library" });
  }
});


module.exports = router;
