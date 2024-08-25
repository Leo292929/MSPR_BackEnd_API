const { connection } = require('../config/database');

const Espece = {
    // Récupérer toutes les espèces
    getAll: (callback) => {
        const query = 'SELECT * FROM Espece';
        connection.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    // Trouver une espèce par son ID
    findById: (id, callback) => {
        const query = 'SELECT * FROM Espece WHERE idEspece = ?';
        connection.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results[0]);
        });
    },

    // Créer une nouvelle espèce
    create: (especeData, callback) => {
        const query = 'INSERT INTO Espece (nomEspece, descriptionEspece, nomLatin, famille, taille, region, habitat, funfact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(query, [
            especeData.nomEspece, 
            especeData.descriptionEspece, 
            especeData.nomLatin, 
            especeData.famille, 
            especeData.taille, 
            especeData.region, 
            especeData.habitat, 
            especeData.funfact
        ], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results.insertId);
        });
    },

    // Mettre à jour une espèce par son ID
    update: (id, updatedData, callback) => {
        const query = 'UPDATE Espece SET ? WHERE idEspece = ?';
        connection.query(query, [updatedData, id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    // Supprimer une espèce par son ID
    delete: (id, callback) => {
        const query = 'DELETE FROM Espece WHERE idEspece = ?';
        connection.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
};

//module.exports = Espece;