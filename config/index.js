
const express = require("express");

const logger = require("morgan");


const cookieParser = require("cookie-parser");


const cors = require("cors");

// const FRONTEND_URL = process.env.ORIGIN || "https://u-play.vercel.app"


module.exports = (app) => {

  app.set("trust proxy", 1);



  app.use(
    cors({
      origin:  "https://u-play.vercel.app",
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






