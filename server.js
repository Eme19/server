
// const app = require("./app");


// const PORT = process.env.PORT || 5005;


// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });





const express = require('express');
const cors = require('cors');

const app = express();


const corsOptions = {
  origin: 'https://u-play.vercel.app',
  credentials: true,
};

app.use(cors(corsOptions));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

