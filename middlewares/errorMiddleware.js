exports.notFound = (req, res, next) => {
  const error = `Can't ${req.method} ${req.path}`;

  return res.status(404).json({
    status: 'fail',
    message: error,
  });
};

exports.errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  return res.status(statusCode).json({
    status: 'fail',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
