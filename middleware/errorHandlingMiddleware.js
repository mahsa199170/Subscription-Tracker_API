const errorHandlingMiddleware = (err, req, res, next) => {
  //   console.log('Error Properties:', Object.getOwnPropertyNames(err));
  //   console.log(
  //     'Error Prototype Properties:',
  //     Object.getOwnPropertyNames(Object.getPrototypeOf(err))
  //   );

  try {
    let error = { ...err };
    error.message = err.message;

    //mongoose validation error
    if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(', '));
      error.statusCode = 400;
    }
    if (err.name === 'MongoNetworkError') {
      return res
        .status(500)
        .json({ success: false, message: 'Database connection error' });
    }

    //mongoose duplicate key
    if (err.code === 11000) {
      error = new Error('Duplicate value, please enter unique value !');
      error.statusCode = 400;
    }

    //mongoose bad objectId
    if (err.name === 'CastError') {
      error = new Error('Resource not found!');
      error.statusCode = 404;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
    console.log(err);
  } catch (error) {
    next(error);
  }
};

module.exports = errorHandlingMiddleware;
