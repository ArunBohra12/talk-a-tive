const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

exports.fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async results => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name picture sender',
        });

        res.status(200).json({
          status: 'success',
          data: { results },
        });
      });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
});

exports.accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log('User Id not missing from the request body'.bgYellow.white);

    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [{ users: { $elemMatch: { $eq: req.user._id } } }, { users: { $elemMatch: { $eq: userId } } }],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name picture sender',
  });

  if (isChat.length > 0) {
    res.status(200).json({
      status: 'success',
      data: isChat[0],
    });
  } else {
    const chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password');

      res.status(200).json({
        status: 'success',
        data: fullChat,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }
});

exports.createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please fill all the fields',
    });
  }

  const users = req.body.users;

  if (users.length < 2) {
    return res.status(400).json({
      status: 'fail',
      message: 'More than 2 users are required to form a group chat',
    });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json({
      status: 'success',
      data: { fullGroupChat },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
});

exports.renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    res.status(404).json({
      status: 'fail',
      message: 'Chat not found',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: { updatedChat },
    });
  }
});

exports.addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    return res.status(404).json({
      status: 'fail',
      message: 'Chat not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { added },
  });
});

exports.removeToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    return res.status(404).json({
      status: 'fail',
      message: 'Chat not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { updatedChat },
  });
});
