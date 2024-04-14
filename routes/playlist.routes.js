const router = require("express").Router();
const Track = require("../models/Track.model");
const Playlist = require("../models/Playlist.model");
const fileUploader = require("../config/cloudinary.config");

const { isAuthenticated } = require("../middlewares/jwt.middleware");

const mongoose = require("mongoose");

router.post(
  "/create",
  fileUploader.single("image"),
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { description, name, trackIds } = req.body;


      if (!Array.isArray(trackIds)) {
        return res.status(400).json({ message: "Track IDs must be provided as an array." });
      }

  
      const isValidTrackIds = trackIds.every((trackId) => mongoose.Types.ObjectId.isValid(trackId));
      if (!isValidTrackIds) {
        return res.status(400).json({ message: "One or more specified track IDs are not valid." });
      }

  
      const selectedTracks = await Track.find({ _id: { $in: trackIds } });

 
      if (selectedTracks.length !== trackIds.length) {
        return res.status(400).json({ message: "One or more selected tracks are invalid." });
      }

 
      const createPlaylistDB = await Playlist.create({
        description,
        image: req.file.path,
        name,
        track: selectedTracks,
      });

      res.status(201).json({ createPlaylistDB });
      console.log("Created playlist:", createPlaylistDB);
    } catch (error) {
      console.error("Error creating playlist:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);






router.get("/playlist/all", async (req, res, next) => {
  try {
    const playlists = await Playlist.find();
    res.status(200).json({ all: playlists });
  } catch (err) {
    console.error("Error while getting all playlists", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/playlist/:id", async (req, res, next) => {
  try {
    const playlistId = req.params.id;

    if (!playlistId) {
      res.status(400).json({ message: "Playlist ID is missing" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      res.status(400).json({ message: "Invalid Playlist ID" });
      return;
    }

    const getPlaylistByIdDB = await Playlist.findById(playlistId).populate(
      "track"
    );
    if (!getPlaylistByIdDB) {
      res.status(404).json({ message: "Playlist not found" });
      return;
    }

    res.status(200).json({ getPlaylistByIdDB });
  } catch (error) {
    console.error("Error fetching playlist by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/playlist/:playlistId", isAuthenticated, async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      res.status(400).json({ message: "Invalid Playlist ID" });
      return;
    }

    const playlistUpdateById = await Playlist.findByIdAndUpdate(
      playlistId,
      req.body,
      {
        new: true,
      }
    );

    if (!playlistUpdateById) {
      res.status(404).json({ message: "Playlist not found" });
      return;
    }

    res.status(200).json(playlistUpdateById);
  } catch (error) {
    console.error("Error updating playlist by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete(
  "/playlist/:playlistId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { playlistId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        res.status(400).json({ message: "Invalid Playlist ID" });
        return;
      }

      const findAndDeleteDB = await Playlist.findByIdAndRemove(playlistId);

      if (!findAndDeleteDB) {
        res.status(404).json({ message: "Playlist not found" });
        return;
      }

      res.status(200).json(findAndDeleteDB);
    } catch (error) {
      console.error("Error deleting playlist by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
