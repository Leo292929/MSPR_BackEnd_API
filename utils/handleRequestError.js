const logger = require('./logger');

const handleRequestError = (res, error, message = 'Une erreur est survenue sur le serveur') => {
    logger.error(error);
    res.status(500).send(message);
};

module.exports = handleRequestError;