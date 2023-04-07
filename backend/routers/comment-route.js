const router = require("express").Router();
const Comment = require("../models").commentModel;

router.use((req, res, next) => {
  console.log("A request is coming in to comment.js");
  next();
});

//POST comment
router.post("", async (req, res) => {
  let newComment = new Comment({ ...req.body, writer: req.user._id });
  try {
    const saveComment = await newComment.save((err, newComment) => {
      Comment.find({ _id: newComment._id })
        .populate("writer")
        .then((result) => {
          res.status(200).send(result);
        });
    });
  } catch (error) {
    res.send(error);
  }
});

//GET every single comments
router.get("", (req, res) => {
  let { episode } = req.query;
  Comment.find({ episode })
    .populate("writer")
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
