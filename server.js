
const app = require("./app");
const cors = require('cors')

app.use(cors())
const PORT = process.env.PORT || 5005;


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
