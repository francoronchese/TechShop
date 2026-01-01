// Utility to handle async logic in controllers
// Automatically catches any errors and sends them to the global error middleware

const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // Handles unexpected server-side errors automatically on errorMiddleware
      next(error);
    }
  };
};

export default asyncHandler;
