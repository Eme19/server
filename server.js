
const app = require("./app");
const cors = require('cors');


const PORT = process.env.PORT || 5005;
app.use(cors({
  origin: 'https://u-play.vercel.app',
  methods: ['GET', 'OPTIONS', 'PATCH', 'DELETE', 'POST', 'PUT'],
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version'],
  credentials: true
}));


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
