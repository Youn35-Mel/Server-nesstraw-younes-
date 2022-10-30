const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const { readVideo, writeVideo } = require("../utils/helpers");
const { v4: uuidv4 } = require("uuid");
const { stringify } = require("querystring");

//get all videos with all properties
// router.get("/", videoController);
router.get("/", (req, res) => {
  const videos = readVideo();
  res.status(200).json(videos);
});

// //========== WHEN CLIENT REQUESTS: GET from "/VIDEOS/:ID"

router.get("/:id", (req, res) => {
  const videos = readVideo();
  const currentVideo = videos.filter((video) => video.id === req.params.id);
  !currentVideo
    ? res
        .status(400)
        .send({ errorMessage: `Video with ID:${req.params.id} not found` })
    : res.status(200).json(currentVideo);
});

// //========== WHEN CLIENT REQUESTS: POST to "/VIDEOS"
router.post("/", (req, res) => {
  const videos = readVideo();
  if (Object.keys(req.body).length === 0) {
    res.status(404).json({ errorMessage: "request needs a body" });
    return;
  }
  const { title, channel, image, description, duration, video, comments } =
    req.body;
  req.body;
  const newVideo = {
    id: uuidv4(),
    title: title,
    channel: channel,
    image: image,
    description: description,
    views: "0",
    likes: "0",
    duration: duration,
    video: "https://ichef.bbci.co.uk/images/ic/960x540/p0b2w95p.jpg",
    timestamp: new Date().getTime(),
    comments: [],
  };
  if (!newVideo.title || !newVideo.description) {
    return res.status(400).json({
      errorMessage: "Please provide title, description, and the video",
    });
  }
  videos.unshift(newVideo);
  writeVideo(videos);
  res.status(200).json(videos);
});

// //========== WHEN CLIENT ADD COMMENT TO VIDEO"
router.post("/:id/comments", (req, res) => {
  // res.send(req.params.id);
  const videos = readVideo();
  const found = videos.some((video) => video.id === req.params.id);
  if (found) {
    const { name, comment } = req.body;
    if (req.body.comment) {
      const newComment = {
        id: uuidv4(),
        name: name,
        comment: comment,
        likes: 0,
        timestamp: new Date().getTime(),
      };
      const commentList = videos
        .find((video) => video.id === req.params.id)
        .comments.unshift(newComment);
      writeVideo(videos);
      return res.status(200).json(videos);
    } else {
      return res.status(400).json({ errorMessage: "Please enter a comment" });
    }
  } else {
    return res
      .status(400)
      .json({ errorMessage: `Video with ID:${req.params.id} not found` });
  }
});

// //delete 2
router.delete("/:id/comments/:commentId", (req, res) => {
  // res.send(req.params.id);
  const videos = readVideo();
  const commentId = req.params.commentId;
  const videoId = req.params.id;

  const found = videos.some((video) => video.id === videoId);

  if (found) {
    // Get the individual video
    const video = videos.find((video) => video.id === videoId);

    // Filter the individual videos comments (to remove the deleted comment)
    const updatedComments = video.comments.filter(
      (comment) => comment.id !== commentId
    );

    // We have to update `videos` to have the filtered video comments
    const videoIndex = videos.findIndex((video) => video.id === videoId);

    // Go to the video, and the comments, and reassign the video comments equal to the filtered comments
    videos[videoIndex].comments = updatedComments;

    // Now we've updated `videos` to have the filtered comments - save it to the file
    writeVideo(videos);
    return res.status(204).end();
  } else {
    return res.status(400).json({ errorMessage: `cannot delete the comment` });
  }
});

// //likes 2
// router.put("/:id/likes/:commentId", (req, res) => {
//   const videos = readVideo();
//   const videoId = req.params.id;
//   const commentId = req.params.commentId;

//   const found = videos.some((video) => video.id === videoId);
//   if (found) {
//     const updateLike = videos.like.find((like) => like.id === commentId);

//     const videoIndex = videos.findIndex((video) => video.id === videoId);

//     videos[videoIndex].likes = updateLike;

//     writeVideo(videos);
//     return res.status(204).end();
//   } else {
//     return res.status(400).json({ errorMessage: `cannot like the comment` });
//   }
// });

module.exports = router;
