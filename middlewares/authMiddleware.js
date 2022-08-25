const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      return next();
    } catch (err) {
      console.log(err);
      res.status(401).json({
        status: 'fail',
        message: 'Not authorized, token failed!',
      });
    }
  }

  res.status(401).json({
    status: 'fail',
    message: 'Please provide the authorization token.',
  });
});
