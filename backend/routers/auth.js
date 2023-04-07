const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("A request is coming in to auth.js");
  next();
});

router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Test API is working",
  };
  return res.send(msgObj);
});

router.post("/register", async (req, res) => {
  // check the validation of data
  const { error } = registerValidation(req.body);
  if (error) {
    return res.send(error.details[0].message);
  }
  // check if the user exists
  let { username, password, verifyPassword } = req.body;
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  try {
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res.send("emailAlert");
    } else {
      const saveUser = await newUser.save();
      res.send("registerSuccess!");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if the user exists
  let { username, password } = req.body;

  User.findOne({ username }, function (err, user) {
    if (err) {
      res.send(err);
    }
    if (!user) {
      res.send("userAlert");
    } else {
      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          res.send(err);
        }
        if (isMatch) {
          const tokenObject = { _id: user._id, username: user.username };
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
          res.send({
            success: true,
            token: "JWT " + token,
            user,
          });
        } else {
          res.send("passwordAlert");
        }
      });
    }
  });
});

module.exports = router;
