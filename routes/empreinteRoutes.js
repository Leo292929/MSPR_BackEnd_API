const express = require('express');
const router = express.Router();
const empreinteController = require('../controllers/empreinteController');

router.get('/', empreinteController.getAll);
router.get('/:id', empreinteController.getById);
router.post('/', empreinteController.create);
router.put('/:id', empreinteController.update);
router.delete('/:id', empreinteController.delete);

module.exports = router;