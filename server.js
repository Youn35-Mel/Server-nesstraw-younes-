const express = require("express");
const app = express();
const videoRoutes = require("./routes/videoRoutes");

require("dotenv").config();
const { PORT } = process.env;

//MIDDLEWARE
const cors = require("cors");
app.use(cors());
app.use(express.json());

//Api routes
app.use("/videos", videoRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
