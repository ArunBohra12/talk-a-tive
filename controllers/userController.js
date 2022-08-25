const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwt');

exports.allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ status: 'fail', message: 'Please enter all of the fields' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ status: 'fail', message: 'User with that email already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    picture,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(500).json({ status: 'fail', message: 'Failed to create the user' });
  }
});

exports.authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 'fail', message: 'Please provide both email and password' });
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  }

  res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
});
