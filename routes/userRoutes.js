const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/register', userController.register);
router.get('/profile', userController.getUserProfile);
//router.put('/profile', userController.updateProfile);

module.exports = router;