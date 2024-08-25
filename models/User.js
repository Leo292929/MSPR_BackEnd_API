const { connection } = require('../config/database');

const User = {
    // Trouver un utilisateur par son nom d'utilisateur
    findByUsername: (username, callback) => {
        const query = 'SELECT * FROM Utilisateur WHERE nomUser = ?';
        connection.query(query, [username], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results[0]);
        });
    },

    // Trouver un utilisateur par son ID
    findById: (id, callback) => {
        const query = 'SELECT * FROM Utilisateur WHERE idUser = ?';
        connection.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results[0]);
        });
    },

    // Créer un nouvel utilisateur
    create: (userData, callback) => {
        const query = 'INSERT INTO Utilisateur (nomUser, mdpUser, emailUser) VALUES (?, ?, ?)';
        connection.query(query, [userData.nomUser, userData.mdpUser, userData.emailUser], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results.insertId);
        });
    },

    // Mettre à jour les informations d'un utilisateur
    update: (id, updatedData, callback) => {
        const query = 'UPDATE Utilisateur SET ? WHERE idUser = ?';
        connection.query(query, [updatedData, id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    // Supprimer un utilisateur par son ID
    delete: (id, callback) => {
        const query = 'DELETE FROM Utilisateur WHERE idUser = ?';
        connection.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
};

module.exports = User;