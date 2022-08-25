const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(authMiddleware.protect, userController.allUsers).post(userController.registerUser);
router.route('/login').post(userController.authUser);

module.exports = router;
