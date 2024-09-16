// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();


// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const trackRoutes = require("./routes/track.routes");
app.use("/api", trackRoutes);

const playlistRoutes = require("./routes/playlist.routes");
app.use("/api", playlistRoutes);

const albumRoutes = require("./routes/album.routes");
app.use("/api", albumRoutes);

const artistRoutes = require("./routes/artist.routes");
app.use("/api", artistRoutes);


const libraryRoutes = require("./routes/library.routes");
app.use("/library", libraryRoutes);

const searchRoutes = require("./routes/searchbar.routes");
app.use("/api", searchRoutes)



const appactivityRoutes = require("./routes/appactivity.routes");
app.use("/activity", appactivityRoutes)

const streamRoutes = require("./routes/streaming.routes");
app.use("/stream", streamRoutes)

// const spotifyRoutes = require("./routes/spotify.routes");
// app.use("/spotify", spotifyRoutes);
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
