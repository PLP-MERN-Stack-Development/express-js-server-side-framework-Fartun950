class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function errorHandler(err, req, res, next) {
  console.error('ERROR:', err.message);
  res.status(err.statusCode || 500).json({ status: 'error', message: err.message || 'Internal Server Error' });
}

module.exports = { AppError, errorHandler };
