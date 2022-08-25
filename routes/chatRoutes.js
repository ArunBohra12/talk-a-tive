const express = require('express');
const chatController = require('../controllers/chatControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(authMiddleware.protect, chatController.fetchChats)
  .post(authMiddleware.protect, chatController.accessChat);

router.route('/group').post(authMiddleware.protect, chatController.createGroupChat);
router.route('/rename').put(authMiddleware.protect, chatController.renameGroup);
router.route('/add-to-group').put(authMiddleware.protect, chatController.addToGroup);
router.route('/remove-from-group').put(authMiddleware.protect, chatController.removeToGroup);

module.exports = router;
