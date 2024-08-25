const {connection} = require('../config/database');
const passport = require('passport');

// Inscription d'un nouvel utilisateur
exports.register = (req, res) => {
    const { nomUser, mdpUser } = req.body;

    // Validation des données
    if (!nomUser || !mdpUser) {
        return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe sont requis' });
    }

    // Insertion du nouvel utilisateur dans la base de données
    const query = 'INSERT INTO Utilisateur (nomUser, mdpUser) VALUES (?, ?)';
    connection.query(query, [nomUser, mdpUser], (error, results) => {
        if (error) {
            console.error('Erreur lors de l\'inscription de l\'utilisateur : ', error);
            return res.status(500).json({ message: 'Erreur lors de l\'inscription de l\'utilisateur' });
        }
        res.status(201).json({ idUser: results.insertId, nomUser });
    });
};

// Connexion de l'utilisateur
exports.login = passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
});

// Déconnexion de l'utilisateur
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

// Récupérer les informations de l'utilisateur connecté
exports.getUserProfile = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Non authentifié' });
    }

    const userId = req.user.idUser;
    const query = 'SELECT * FROM Utilisateur WHERE idUser = ?';

    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des informations utilisateur : ', error);
            return res.status(500).json({ message: 'Erreur lors de la récupération des informations utilisateur' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(results[0]);
    });
};