const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");
const authRoute = require("./routers").auth;
const animeRoute = require("./routers").anime;
const historyRoute = require("./routers").history;
const profileRoute = require("./routers").profile;
const commentRoute = require("./routers").comment;
const likeRoute = require("./routers").like;
// const User = require("./models").userModel;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

mongoose
  .connect(process.env.DB_CONNECT, {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((e) => {
    console.log(e);
  });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use("/api/user", authRoute);
app.use(
  "/api/animes",
  passport.authenticate("jwt", { session: false }),
  animeRoute
);
app.use(
  "/api/history",
  passport.authenticate("jwt", { session: false }),
  historyRoute
);
app.use(
  "/api/profile",
  passport.authenticate("jwt", { session: false }),
  profileRoute
);
app.use(
  "/api/comments",
  passport.authenticate("jwt", { session: false }),
  commentRoute
);

app.use(
  "/api/thumbs",
  passport.authenticate("jwt", { session: false }),
  likeRoute
);

app.listen(4000, () => {
  console.log("Server is running on port 4000.");
});
