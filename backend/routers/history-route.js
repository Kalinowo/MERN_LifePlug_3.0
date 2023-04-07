const router = require("express").Router();

const animeValidation = require("../validation").animeValidation;

const History = require("../models").historyModel;

router.use((req, res, next) => {
  console.log("A request is coming in to history-route.js");
  next();
});

router.get("/", (req, res) => {
  let { _id } = req.query;
  if (req.user.id === _id) {
    History.find({ user_id: _id })
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    res.send("資料遭到串改");
  }
});

router.post("/", async (req, res) => {
  let { user_id, title, engName, img, episode, length, currentTime } = req.body;
  let newHistory = new History({
    user_id,
    title,
    engName,
    img,
    episode,
    length,
    currentTime,
  });

  try {
    const foundData = await History.findOne({ user_id, title });
    if (req.user.id === user_id) {
      if (foundData) {
        History.findOneAndUpdate(
          { user_id, title },
          { episode, currentTime, date: Date.now() },
          {
            useFindAndModify: false,
            new: true,
          }
        )
          .then((msg) => {
            console.log("更新觀看紀錄");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const saveHistory = await newHistory.save();
        res.send("成功建立觀看紀錄");
      }
    } else {
      res.send("資料遭到串改");
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/lastwatch", (req, res) => {
  let { title, _id } = req.query;
  if (req.user.id === _id) {
    History.find({ title, user_id: _id })
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    res.send("資料遭到串改");
  }
});

module.exports = router;
