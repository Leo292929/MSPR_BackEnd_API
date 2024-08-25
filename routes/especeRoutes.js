const express = require('express');
const router = express.Router();
const especeController = require('../controllers/especeController');

router.get('/', especeController.getAll);
router.get('/:id', especeController.getById);
router.post('/', especeController.create);
router.put('/:id', especeController.update);
router.delete('/:id', especeController.delete);

module.exports = router;