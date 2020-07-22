const express = require('express');

const router = express.Router({ mergeParams: true });
const middleware = require('./internal-modules/middleware.js');

const authController = require('../Controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.logout);

module.exports = router;
