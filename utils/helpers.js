const fs = require("fs");

const readVideo = () => {
  return JSON.parse(fs.readFileSync("./data/test.json"));
};

const writeVideo = (videoData) => {
  fs.writeFileSync("./data/test.json", JSON.stringify(videoData));
};

module.exports = { readVideo, writeVideo };
