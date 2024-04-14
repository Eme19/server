
// const express = require("express");

// const logger = require("morgan");


// const cookieParser = require("cookie-parser");


// const cors = require("cors");

// const FRONTEND_URL = process.env.ORIGIN || "https://u-play.vercel.app"


// module.exports = (app) => {

//   app.set("trust proxy", 1);



//   app.use(
//     cors({
//       origin: [FRONTEND_URL],
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//       allowedHeaders: ['Content-Type', 'Authorization'],
//       credentials: true,
//       preflightContinue: false, 
//       optionsSuccessStatus: 204 
//     })
//   );
  


//   app.use(logger("dev"));

//   app.use(express.json());
//   app.use(express.urlencoded({ extended: false }));
//   app.use(cookieParser());
// };










const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

module.exports = (app) => {
  app.set("trust proxy", 1);

  // Enable CORS
  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
  );

  app.use(cookieParser());
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};
