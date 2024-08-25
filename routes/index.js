const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const empreinteRoutes = require('./empreinteRoutes');
const especeRoutes = require('./especeRoutes');
const classificationRoutes = require('./classificationRoutes');

// Les routes utilisateur
router.use('/users', userRoutes);

// Les routes empreintes
router.use('/empreintes', empreinteRoutes);

// Les routes espèces
router.use('/especes', especeRoutes);

// Les routes classifications
router.use('/classification', classificationRoutes);

module.exports = router;