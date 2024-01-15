const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new ErrorResponse(`Resource not found`, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = new ErrorResponse('Duplicate field value entered', 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = new ErrorResponse(
      Object.values(err.errors).map((val) => val.message),
      400
    );
  }

  // Jwt not authorization error
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorResponse('Not authorized to access this route', 401);
  }

  // Token expired error
  if (err.name === 'TokenExpiredError') {
    error = new ErrorResponse(`Please log in again`, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
