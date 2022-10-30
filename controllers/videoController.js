const videos = require("../models/videoModel");
const fs = require("fs");

function listVideos(req, res) {
  res.json(videos.list());
}
