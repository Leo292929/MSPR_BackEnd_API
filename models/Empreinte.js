const { connection } = require('../config/database');

const Empreinte = {
    // Récupérer toutes les empreintes
    getAll: (callback) => {
        const query = 'SELECT * FROM Empreinte';
        connection.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    // Trouver une empreinte par son ID
    findById: (id, callback) => {
        const query = 'SELECT * FROM Empreinte WHERE idEmpreinte = ?';
        connection.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results[0]);
        });
    },

    // Créer une nouvelle empreinte
    create: (empreinteData, callback) => {
        const query = 'INSERT INTO Empreinte (idUser, idEspece, adresseImage, datePhoto, heurePhoto, localisation) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(query, [
            empreinteData.idUser, 
            empreinteData.idEspece, 
            empreinteData.adresseImage, 
            empreinteData.datePhoto, 
            empreinteData.heurePhoto, 
            empreinteData.localisation
        ], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results.insertId);
        });
    },

    // Mettre à jour une empreinte par son ID
    update: (id, updatedData, callback) => {
        const query = 'UPDATE Empreinte SET ? WHERE idEmpreinte = ?';
        connection.query(query, [updatedData, id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    // Supprimer une empreinte par son ID
    delete: (id, callback) => {
        const query = 'DELETE FROM Empreinte WHERE idEmpreinte = ?';
        connection.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
};

module.exports = Empreinte;