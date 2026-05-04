const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Invalid email format"],
    unique: true,
    lowercase: true,
  },
  userName: {
    type: String,
    required: [true, "User Name is required"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9 ]+$/.test(v);
      },
      message: "Username can only contain letters, numbers, and spaces",
    },
    unique: true,
    trim: true,
  },
  password: {
    type: String,

    required: [true, "Your password is required"],
    minlength: [6, "Min 6 characters"],
    select: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
//HASHPASSWORD BEFORE SAVING
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

//COMPARE PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//GENERATE RESET TOKEN
userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
