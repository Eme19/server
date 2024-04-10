

const cors = require('cors');

const corsOptions = {
  origin: 'https://uplay-git-main-eme19s-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const configureCors = () => {
  return cors(corsOptions);
};

module.exports = configureCors;
