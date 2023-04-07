const router = require("express").Router();
const Like = require("../models").likeModel;
const Dislike = require("../models").dislikeModel;

router.use((req, res, next) => {
  console.log("A request is coming in to like.js");
  next();
});

router.get("/likenumbers", (req, res) => {
  let { commentId } = req.query;
  Like.find({ commentId })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/dislikenumbers", (req, res) => {
  let { commentId } = req.query;
  Dislike.find({ commentId })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/like", async (req, res) => {
  let { commentId } = req.body;

  let newLike = new Like({
    userId: req.user._id,
    commentId,
  });

  try {
    const saveComment = await newLike.save((err, newLike) => {
      Dislike.deleteMany({ commentId }).then((result) => {
        res.status(200).send(result);
      });
    });
  } catch (err) {
    res.send(err);
  }
});

router.delete("/like", async (req, res) => {
  let { commentId } = req.query;

  Like.deleteMany({ commentId })
    .then((res) => {
      res.status(200);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/dislike", async (req, res) => {
  let { commentId } = req.body;

  let newDislike = new Dislike({
    userId: req.user._id,
    commentId,
  });

  try {
    const saveComment = await newDislike.save((err, newDislike) => {
      Like.deleteMany({ commentId }).then((result) => {
        res.status(200).send(result);
      });
    });
  } catch (err) {
    res.send(err);
  }
});

router.delete("/dislike", async (req, res) => {
  let { commentId } = req.query;

  Dislike.deleteMany({ commentId })
    .then((res) => {
      res.status(200);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
