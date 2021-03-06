const { Schema, model } = require("mongoose");
const { comparePassword, hashPassword } = require("../utils/services");
const userSchema = new Schema({
  username: { type: String, required: true, minlength: 3, unique: true },
  hashedPassword: { type: String, required: true },
});

userSchema.methods.comparePassword = async function (password) {
  // Use bcrypt to hash and compare incoming pass with stores hashed passes
  return await comparePassword(password, this.hashedPassword);
};

userSchema.index(
  { username: 1 },
  {
    unique: true,
    collation: {
      locale: "en",
      strength: 2,
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("hashedPassword")) {
    console.log("hashing new password");
    this.hashedPassword = await hashPassword(this.hashedPassword);
  }

  next();
});

const User = model("User", userSchema);

module.exports = User;
