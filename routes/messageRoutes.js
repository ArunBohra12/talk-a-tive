const express = require('express');
const messageController = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(protect, messageController.sendMessage);
router.route('/:chatId').get(protect, messageController.allMessages);

module.exports = router;
