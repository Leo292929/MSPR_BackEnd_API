const {connection} = require('../config/database');
const handleRequestError = require('../utils/handleRequestError');

// Récupérer toutes les espèces
exports.getAll = (req, res) => {
    const query = 'SELECT * FROM Espece';

    connection.query('SELECT * FROM Espece', (error, results) => {
        if (error) {
            return handleRequestError(res, error);
        }
        res.json(results);


    });
};

// Récupérer une espèce par ID
exports.getById = (req, res) => {
    const id = req.params.id;
    const queri = 'SELECT * FROM Espece WHERE idEspece = ?';

    connection.query(queri, [id], (error, results) => {
        
        if (error) {
            return handleRequestError(res, error);
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Espèce non trouvée" });
        }
        res.json(results[0]);
        
    });
};

// Créer une nouvelle espèce
exports.create = (req, res) => {
    const { nomEspece, descriptionEspece } = req.body;

    // Validation des données
    if (!nomEspece || !descriptionEspece) {
        return res.status(400).json({ message: 'Le nom de l\'espèce et sa description sont requis' });
    }

    const query = 'INSERT INTO Espece (nomEspece, descriptionEspece) VALUES (?, ?)';

    connection.query(query, [nomEspece, descriptionEspece], (error, results) => {
        if (error) {
            console.error('Erreur lors de l\'insertion de l\'espèce : ', error);
            return res.status(500).json({ message: 'Erreur lors de la création de l\'espèce' });
        }
        res.status(201).json({ idEspece: results.insertId });
    });
};

// Mettre à jour une espèce existante
exports.update = (req, res) => {
    const idEspece = req.params.id;
    const updatedFields = req.body;

    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: "Aucun champ fourni pour la mise à jour de l'espèce." });
    }

    const query = 'UPDATE Espece SET ? WHERE idEspece = ?';
    connection.query(query, [updatedFields, idEspece], (error, results) => {
        if (error) {
            console.error('Erreur lors de la mise à jour de l\'espèce : ', error);
            return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de l'espèce." });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Espèce non trouvée" });
        }
        res.status(200).json({ message: "Espèce mise à jour avec succès" });
    });
};

// Supprimer une espèce
exports.delete = (req, res) => {
    const idEspece = req.params.id;
    const query = 'DELETE FROM Espece WHERE idEspece = ?';

    connection.query(query, [idEspece], (error, results) => {
        if (error) {
            console.error('Erreur lors de la suppression de l\'espèce : ', error);
            return res.status(500).json({ message: 'Erreur lors de la suppression de l\'espèce' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Espèce non trouvée" });
        }
        res.status(200).json({ message: "Espèce supprimée avec succès" });
    });
};