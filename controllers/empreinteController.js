const {connection} = require('../config/database'); // Connexion à la base de données
const handleRequestError = require('../utils/handleRequestError'); // Gestion des erreurs

// Récupérer toutes les empreintes
exports.getAll = (req, res) => {
    const query = 'SELECT * FROM Empreinte';

    connection.query(query, (error, results) => {
        if (error) {
            return handleRequestError(res, error);
        }
        res.json(results);
    });
};

// Récupérer une empreinte par ID
exports.getById = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Empreinte WHERE idEmpreinte = ?';

    connection.query(query, [id], (error, results) => {
        if (error) {
            return handleRequestError(res, error);
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Empreinte non trouvée" });
        }
        res.json(results[0]);
    });
};

// Créer une nouvelle empreinte
exports.create = (req, res) => {
    const { idUser, idEspece, adresseImage, datePhoto, heurePhoto, localisation } = req.body;
    const query = 'INSERT INTO Empreinte (idUser, idEspece, adresseImage, datePhoto, heurePhoto, localisation) VALUES (?, ?, ?, ?, ?, ?)';

    connection.query(query, [idUser, idEspece, adresseImage, datePhoto, heurePhoto, localisation], (error, results) => {
        if (error) {
            return handleRequestError(res, error);
        }
        res.status(201).json({ id: results.insertId });
    });
};

// Mettre à jour une empreinte existante
exports.update = (req, res) => {
    const id = req.params.id;
    const updatedFields = req.body;
    let query = 'UPDATE Empreinte SET ? WHERE idEmpreinte = ?';

    connection.query(query, [updatedFields, id], (error, results) => {
        if (error) {
            return handleRequestError(res, error);
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Empreinte non trouvée" });
        }
        res.status(200).json({ message: "Empreinte mise à jour avec succès" });
    });
};

// Supprimer une empreinte
exports.delete = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Empreinte WHERE idEmpreinte = ?';

    connection.query(query, [id], (error, results) => {
        if (error) {
            return handleRequestError(res, error);
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Empreinte non trouvée" });
        }
        res.status(200).json({ message: "Empreinte supprimée avec succès" });
    });
};