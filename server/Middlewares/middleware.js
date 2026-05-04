const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const CustomError = require("./../util/CustomError");
const User = require("./../Model/UserModel");

module.exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return next(new CustomError("Authentication required..", 401));

    // Promisify jwt.verify
    const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_KEY);

    // Optional: Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) return next(new CustomError("User no longer exists", 401));

    req.user = user; // attach user to request

    next(); // proceed to next middleware or controller
  } catch (err) {
    next(err);
  }
};
