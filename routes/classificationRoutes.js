const express = require('express');
const router = express.Router();
const classificationController = require('../controllers/classificationController');

router.post('/classify', classificationController.uploadAndClassify);

module.exports = router;
