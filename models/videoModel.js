const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { readVideo, writeVideo } = require("../utils/helpers");

function getVideos() {
  const videos = readVideo();
  res.status(200).json(videos);
}
