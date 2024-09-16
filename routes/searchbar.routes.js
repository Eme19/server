const express = require("express");
const router = express.Router();
const Album = require("../models/Album.model");
const Artist = require("../models/Artist.model");
const Track = require("../models/Track.model");

router.get("/search", async (req, res) => {
  const searchTerm = req.query.term;

  if (!searchTerm) {
    return res.status(400).json({ error: "Search term is required" });
  }

  console.log("Received search request with term:", searchTerm);
  try {
    const albums = await Album.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    const tracks = await Track.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    const artists = await Artist.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    const results = {
      albums,
      tracks,
      artists,
    };

    res.status(200).json({ data: results });
  } catch (err) {
    console.error("Error while retrieving data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;







