


module.exports = async function errorMiddleware(err, req, res, next) {
  try {
    const statusCode = err.statusCode || 500;
    const message = err.message || ERROR_HELPER.getMessage(ErrorKey.INTERNAL_SERVER_ERROR);

    if (process.env.NODE_ENV !== 'production') {
      console.error(err);
    }

    res.status(statusCode).json({
      success: false,
      data: null,
      error: {
        message,
        statusCode
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(errObj);
    }
    next(error);
  }
}