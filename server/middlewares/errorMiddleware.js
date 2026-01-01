// Global error handler middleware

const errorMiddleware = (err, req, res, next) => {
  // Log error stack for development debugging
  console.error(err.stack);

  // Send error response for unexpected server errors
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    error: true,
    success: false,
  });
};

export default errorMiddleware;
