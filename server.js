
// const app = require("./app");


// const PORT = process.env.PORT || 5005;


// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });












const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "https://u-play.vercel.app", // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));


const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
