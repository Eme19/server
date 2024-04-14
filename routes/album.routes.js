const router = require("express").Router();
const Album = require("../models/Album.model");
const Track = require("../models/Track.model");
const Artist = require("../models/Artist.model");
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt.middleware");

const mongoose = require("mongoose");

router.get("/album", async (req, res, next) => {
  try {
    const getAlbumDb = await Album.find().populate("track").populate("artist");
    res.status(200).json({ albums: getAlbumDb });
  } catch (err) {
    console.error("Error while getting all albums:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/album/:id", async (req, res, nex) => {
  const albumId = req.params.id;
  try {
    const albumFindById = await Album.findById(albumId).populate("track");
    if (!albumFindById) {
      res.status(404).json({ message: "Album not found" });
    }
    res.status(200).json({ album: albumFindById });
  } catch (err) {
    console.error("Error while getting ablum track by ID", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/album", fileUploader.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("No files uploaded.");
    }

    const {
      total_tracks,
      title,
      release_date,
      genre,
      popularity,
      album_type,
      trackId,
      artist,
    } = req.body;

    console.log(" req.body", req.body);
    const track = await Track.findById(trackId);

    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    const album = await Album.create({
      total_tracks,
      title,
      release_date,
      genre,
      popularity,
      artist: [artist],
      album_type,
      image: req.file.path,
      track: [track],
    });

    const updateArtist = await Artist.findById(artist);
    updateArtist.album.push(album._id);
    await updateArtist.save();

    res.status(201).json({ album });
  } catch (err) {
    console.error("Error creating album:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/album/:id", async (req, res, next) => {
  try {
    const albumId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    const {
      total_tracks,
      title,
      release_date,
      genre,
      popularity,
      album_type,
      trackIds,
    } = req.body;

    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      {
        total_tracks,
        title,
        release_date,
        genre,
        popularity,
        album_type,
        image: req.file ? req.file.path : undefined,
        track: trackIds,
      },
      { new: true }
    );

    if (!updatedAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.status(200).json(updatedAlbum);
  } catch (err) {
    console.error("Error updating album:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/album/:id", async (req, res, next) => {
  try {
    const albumId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      return res.status(400).json({ message: "Specified id is not valid" });
    }
    const deleteAlbumbyID = await Album.findByIdAndRemove(albumId);
    if (!deleteAlbumbyID) {
      return res
        .status(404)
        .json({ error: `Album with ID ${albumId} not found` });
    }
    res
      .status(200)
      .json({
        message: `Album with ID ${albumId} has been removed successfully`,
      });
  } catch (err) {
    console.error("Error deleting specific album:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
