
require("dotenv").config();


require("./db");

const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});





require("./config")(app);


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
app.use("/api", searchRoutes);

const appactivityRoutes = require("./routes/appactivity.routes");
app.use("/activity", appactivityRoutes);

const googleAuthRoutes = require("./routes/googleid.routes");
app.use("/google", googleAuthRoutes);

const streamRoutes = require("./routes/streaming.routes");
app.use("/stream", streamRoutes);

require("./error-handling")(app);

module.exports = app;
