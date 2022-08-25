const jwt = require('jsonwebtoken');

exports.generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
