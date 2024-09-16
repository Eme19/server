const router = require("express").Router();
const Album = require("../models/Album.model");
const Artist = require("../models/Artist.model");
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt.middleware");


const mongoose = require('mongoose');



router.post("/artist", fileUploader.single("image"),   async (req, res, next) => {
  try {
    if (!req.file) {
        return res.status(400).send("No files uploaded.");
      }

    const { name, genre, popularity } = req.body;

    const newArtist = await Artist.create({ name, genre, image:req.file.path, popularity });
    res.status(201).json({ artist: newArtist });
  } catch (err) {
    console.error("Error creating artist:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/artist", async (req, res, next) => {
  try {
    const artists = await Artist.find();
    res.status(200).json({ artists });
  } catch (err) {
    console.error("Error getting all artists:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/artist/:id", async (req, res, next) => {
  try {
    const artistId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        return res.status(400).json({ message: "Specified id is not valid" });
      }
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.status(200).json({ artist });
  } catch (err) {
    console.error("Error getting artist by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.put("/artist/:id", async (req, res, next) => {
  try {
    const artistId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        return res.status(400).json({ message: "Specified id is not valid" });
      }
    const { name, genre, image, popularity } = req.body;
    const updatedArtist = await Artist.findByIdAndUpdate(
      artistId,
      { name, genre, image, popularity },
      { new: true }
    );
    if (!updatedArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.status(200).json({ artist: updatedArtist });
  } catch (err) {
    console.error("Error updating artist by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/artist/:id", async (req, res, next) => {
  try {
    const artistId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        return res.status(400).json({ message: "Specified id is not valid" });
      }
    const deletedArtist = await Artist.findByIdAndRemove(artistId);
    if (!deletedArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.status(200).json({ message: "Artist deleted successfully" });
  } catch (err) {
    console.error("Error deleting artist by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




router.get("/artist/:artistId/album", async (req, res) => {
  try {
    const { artistId } = req.params;

    
    const artist = await Artist.findById(artistId).populate("album");

    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    
    const albums = artist.albums;
    res.json({ albums });
  } catch (error) {
    console.error("Error fetching artist's albums:", error);
    res.status(500).json({ error: "Error fetching artist's albums" });
  }
});



module.exports = router;






