const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  userlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "listas" }],
});

userSchema.statics.validateUser = async function (username, password) {
  const userfind = await this.findOne({ username });
  if (!userfind) {
    return false;
  }
  const validuser = await bcrypt.compare(password, userfind.password);
  return validuser ? userfind : false;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const usermodel = new mongoose.model("users", userSchema);
module.exports = usermodel;
