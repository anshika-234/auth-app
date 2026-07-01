const User = require("./../Model/UserModel");
const createToken = require("./../util/SecretToken");

const CustomError = require("./../util/CustomError");
const sendMail = require("./../util/sendEmail");
const crypto = require("crypto");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, userName, password } = req.body;
    if (!email || !userName || !password) {
      return next(new CustomError("All fields are required", 400));
    }

    const user = await User.create({
      email,
      userName,
      password,
    });

    const token = createToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      message: "User Signup Successfully...",
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new CustomError("Email and password are required", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new CustomError("Invalid credentials", 401));
    }

    const token = createToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    message: "Logout successfully..",
  });
};

module.exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    res.set("Cache-Control", "no-store");
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new CustomError("Please provide your email", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendMail({
      to: user.email,
      subject: "Password Reset Token",
      text: `Reset your password using this link : ${resetUrl}`,
    });
    res.status(200).json({
      message: "Reset link sent to your email",
      ...(process.env.NODE_ENV !== "production" && { resetToken }),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return next(new CustomError("Please enter the value", 400));
    }

    if (password !== confirmPassword) {
      return next(new CustomError("Passwords do not match", 400));
    }
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new CustomError("Token is Invalid or expired..", 400));
    }
    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (err) {
    next(err);
  }
};
