const express = require("express");

const router = express.Router();

const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

router.get("/album", async (req, res, next) => {
  try {
    const response = await spotifyApi.getAlbum("5U4W9E5WsYb2jUQWePT8Xm");
    console.log("Album ", response.body);
    res.json(response.body);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json({ error: "Unable to fetch album" });
  }
});
