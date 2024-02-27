const router = require("express").Router();
const Track = require("../models/Track.model");
const Album = require("../models/Album.model");
const fileUploader = require("../config/cloudinary.config");
const cloudinary = require("cloudinary").v2;

const { isAuthenticated } = require("../middlewares/jwt.middleware");

const mongoose = require("mongoose");

router.get("/track", async (req, res, next) => {
  try {
    const tracks = await Track.find();
    res.status(200).json({ tracks });
  } catch (err) {
    console.error("Error while getting all tracks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/track",
  fileUploader.single("mp3file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).send("No files uploaded.");
      }
      console.log("show req,file", req.file);
      const { duration, track_number, name, artist } = req.body;
      console.log("show req.file.path", req.file.path);
      console.log("show req.body", req.body);
      const createdTrackDB = await Track.create({
        filename: req.file.path,
        duration,
        track_number,
        name,
        artist,
      });
      res.status(201).json({ createdTrackDB });
      console.log("show created track", createdTrackDB);
    } catch (err) {
      console.log("====through Track  error ====there we go==>", err);
    }
  }
);

router.get("/audio/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received request for track ID:", id);
    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }
    const audioUrl = cloudinary.url(track.filename, { resource_type: "auto" });
    return res.status(200).json({ audioUrl });
  } catch (err) {
    console.error("Error retrieving audio by ID:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/track/:id", async (req, res, next) => {
  try {
    const trackId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(trackId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    const { name, duration, artist, track_number, filename, album } = req.body;

    const updatedTrack = await Track.findByIdAndUpdate(
      trackId,
      {
        name,
        duration,
        artist,
        track_number,
        filename,
        album,
      },
      { new: true }
    );

    if (!updatedTrack) {
      return res.status(404).json({ error: "Track not found" });
    }
    res.status(200).json(updatedTrack);
  } catch (err) {
    console.error("Error updating track:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/track/:id", async (req, res, next) => {
  try {
    const trackId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(trackId)) {
      return res.status(400).json({ message: "Specified id is not valid" });
    }

    const delectTrackById = await Track.findByIdAndRemove(trackId);

    if (!delectTrackById) {
      return res.status(404).json({ error: "Track not found" });
    }
    res.status(200).json(delectTrackById);
  } catch (err) {
    console.error("Error deleting track:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
