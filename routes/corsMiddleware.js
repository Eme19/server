

const cors = require('cors');

const corsOptions = {
  origin: 'https://uplay-d6tb.onrender.com' ,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' ],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const configureCors = () => {
  return cors(corsOptions);
};

module.exports = configureCors;
