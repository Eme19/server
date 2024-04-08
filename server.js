// const cors = require('cors');
// const app = require("./app");
// app.use(cors());
// const PORT = process.env.PORT || 5005;

// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });




const cors = require('cors');
const app = require("./app");

// Enable CORS for all routes
app.use(cors());

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
