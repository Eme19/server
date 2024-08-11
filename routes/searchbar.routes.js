const express = require("express");
const router = express.Router();
const Album = require("../models/Album.model");
const Artist = require("../models/Artist.model");
const Track = require("../models/Track.model");
const Playlist = require("../models/Playlist.model");

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



router.get("/all/search", async (req, res) => {
  const query = req.query.term;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query term is required" });
  }

  try {
    const playlists = await Playlist.find({
      name: { $regex: query, $options: "i" } 
    });

    const albums = await Album.find({
      title: { $regex: query, $options: "i" } 
    });

    const artists = await Artist.find({
      name: { $regex: query, $options: "i" } 
    });

    const tracks = await Track.find({
      name: { $regex: query, $options: "i" } 
    });

    const results = {
      albums,
      playlists,
      tracks,
      artists,
    };

    res.status(200).json({ data: results });
  } catch (err) {
    console.error("Error while retrieving data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/search/playlist', async (req, res) => {
  const query = req.query.term;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query term is required" });
  }

  console.log("Received search request with term:", query);

  try {
    const playlists = await Playlist.find({
      name: { $regex: query, $options: "i" } 
    });

    console.log("playlists", playlists);
    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.get('/search/albums', async (req, res) => {
  const query = req.query.term;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query term is required" });
  }

  console.log("Received search request with term:", query);

  try {
    const albums = await Album.find({
      title: { $regex: query, $options: "i" } 
    });

    console.log("albums", albums);
    res.json(albums);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.get('/search/artist', async (req, res) => {
  const query = req.query.term;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query term is required" });
  }

  console.log("Received search request with term:", query);

  try {
    const artist = await Artist.find({
      name: { $regex: query, $options: "i" } 
    });

    console.log("artist", artist);
    res.json(artist);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.get('/search/song', async (req, res) => {
  const query = req.query.term;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query term is required" });
  }

  console.log("Received search request with term:", query);

  try {
    const song = await Track.find({
      name: { $regex: query, $options: "i" } 
    });

    console.log("song", song);
    res.json(song);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;







