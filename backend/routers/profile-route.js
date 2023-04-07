const router = require("express").Router();
const User = require("../models").userModel;

router.use((req, res, next) => {
  console.log("A request is coming in to profile.js");
  next();
});

router.get("/", (req, res) => {
  User.find({ _id: req.user._id })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});

router.patch("/updateName", async (req, res) => {
  let { user_id, nickname } = req.body;
  if (req.user.id === user_id) {
    try {
      User.findOneAndUpdate(
        { _id: user_id },
        { nickname },
        {
          useFindAndModify: false,
          new: true,
        }
      )
        .then(() => {
          res.send("success");
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("資料遭到串改");
  }
});

router.patch("/updateDP", async (req, res) => {
  let { user_id, picture } = req.body;
  try {
    User.findOneAndUpdate(
      { _id: user_id },
      { picture },
      {
        useFindAndModify: false,
        new: true,
      }
    )
      .then(() => {
        res.send("success");
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
