const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024,
  },
  nickname: {
    type: String,
    default: "尚未設定使用者名稱",
  },
  picture: {
    type: String,
    default: "MoonDefault",
  },
  role: {
    type: String,
    default: "Member",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.isMember = function () {
  return this.role == "member";
};

userSchema.methods.isAdmin = function () {
  return this.role == "Admin";
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);

//yt影片對比
//module.exports = mongoose.model('User", userSchema)
