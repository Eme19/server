// const mongoose = require("mongoose");

// // process.env.MONGODB_URI ||

// const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/uplay";

// mongoose
//   .connect(MONGO_URI)

//   .then((x) => {
//     const dbName = x.connections[0].name;
//     console.log(`Connected to Mongo! Database name: "${dbName}"`);
//   })
//   .catch((err) => {
//     console.error("Error connecting to mongo: ", err);
//   });













const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);


const store = new MongoDBStore({
  uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/uplay",
  collection: 'sessions'
});


store.on('error', function(error) {
  console.error('Session store error:', error);
});

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store 
});

module.exports = sessionMiddleware;
