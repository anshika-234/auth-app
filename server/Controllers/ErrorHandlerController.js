const errorHandler = (err, req, res, next) => {
  let { message = "Something went wrong..", statusCode = 500 } = err;

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
  }

  // Validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(
      (el) => `${el.path}: ${el.properties.message}`,
    );
    message = messages.join(", ");
    statusCode = 400;
  }

  // JWT errors
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
    message = "Authentication failed. Please log in again.";
    statusCode = 401;
  }

  // DEV vs PRODUCTION
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      message,
      error: err,
      stack: err.stack,
    });
  }

  // PRODUCTION (clean response)
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { errorHandler };
