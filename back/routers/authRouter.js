// authRouter.js
const express = require('express');
const { signup, login, forgotPassword,resetPassword,validate } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/validate', validate);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
