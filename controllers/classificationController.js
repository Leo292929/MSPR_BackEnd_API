const path = require('path');
const multer = require('multer');
const axios = require('axios'); // Pour effectuer des requêtes HTTP vers l'API Python
const {connection} = require('../config/database');
const handleRequestError = require('../utils/handleRequestError');
const fs = require('fs');
const FormData = require('form-data')
// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('image');

// Fonction pour gérer l'upload et la classification
exports.uploadAndClassify = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return handleRequestError(res, err);
        }
        
        // Vérification que le fichier a bien été téléchargé
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier téléchargé' });
        }
        else{console.log('fichier telechargé')}

        const filePath = path.resolve(req.file.path);
        const { idUser, localisationempreinte } = req.body;
        const datePhoto = new Date();
        const heurePhoto = datePhoto.toLocaleTimeString();

        try {
            // Créer un form-data pour envoyer l'image
            const form = new FormData();
            form.append('file', fs.createReadStream(filePath));

            // Appel à l'API Python pour classifier l'image
            const response = await axios.post('http://localhost:5000/process', form, {
                headers: form.getHeaders() // Utilisation correcte de getHeaders avec form-data
            });
            
            const classificationResult = response.data.class;

            const idEspece = await getIdEspeceFromClassificationResult(classificationResult);

            // Insertion des informations dans la base de données
            const query = `INSERT INTO Empreinte (idUser, idEspece, adresseImage, datePhoto, heurePhoto, localisationempreinte)
                           VALUES (?, ?, ?, ?, ?, ?)`;
            connection.query(query, [idUser, idEspece, filePath, datePhoto, heurePhoto, localisationempreinte], (error, results) => {
                if (error) {
                    return handleRequestError(res, error);
                }

                res.status(201).json({ 
                    message: 'Image uploadée et classifiée avec succès',
                    idEmpreinte: results.insertId,
                    classificationResult 
                });
            });
        } catch (error) {
            return handleRequestError(res, error);
        }
    });
};

// Fonction pour obtenir l'ID de l'espèce à partir du résultat de la classification
async function getIdEspeceFromClassificationResult(classificationResult) {
    // Cette fonction devrait contenir la logique pour mapper le résultat de la classification
    // à l'ID de l'espèce correspondante dans la base de données
    // Par exemple, une requête SQL pour trouver l'ID
    return new Promise((resolve, reject) => {
        const query = `SELECT idEspece FROM Espece WHERE nomEspece = ? LIMIT 1`;
        connection.query(query, [classificationResult], (error, results) => {
            if (error) {
                console.log("error")
                return reject(error);
            }
            if (results.length > 0) {
                resolve(results[0].idEspece);

            } else {
                resolve(null); // Ou une valeur par défaut si l'espèce n'est pas trouvée
            }
        });
    });
}