
const express = require("express");

const logger = require("morgan");


const cookieParser = require("cookie-parser");


const cors = require("cors");

const FRONTEND_URL = process.env.ORIGIN || "https://u-play.vercel.app"


module.exports = (app) => {

  app.set("trust proxy", 1);



  app.use(
    cors({
      origin: "https://u-play.vercel.app",
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
  


  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};











// const express = require("express");
// const logger = require("morgan");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");

// const FRONTEND_URL = process.env.ORIGIN || "https://u-play.vercel.app";

// // Define allowCors middleware
// const allowCors = fn => async (req, res) => {
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
//   // You can also use the following line to allow requests from any origin
//   // res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//   );
//   if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     return;
//   }
//   return await fn(req, res);
// };

// module.exports = (app) => {
//   app.set("trust proxy", 1);

//   // Apply allowCors middleware to all routes
//   app.use(allowCors);

//   app.use(logger("dev"));
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: false }));
//   app.use(cookieParser());
// };


