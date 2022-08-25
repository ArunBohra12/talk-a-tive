const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

exports.sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid data passed into request',
    });
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate('sender', 'name picture');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name picture email',
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(200).json({
      status: 'success',
      data: { message },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
});

exports.allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name email picture')
      .populate('chat');

    res.status(200).json({
      status: 'success',
      data: { messages },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
});
