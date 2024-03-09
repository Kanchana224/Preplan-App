const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.signup = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields are required");
  }

  if (!validator.isEmail(email)) {
    throw Error("Invalid email");
  }

  if (password.length < 6) {
    throw Error("Password must be 6 characters long");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await this.create({
    email,
    password: encryptedPassword,
  });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields are required");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Email not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw Error("Invalid password");
  }

  return user;
};

module.exports = mongoose.model("Account", userSchema);
