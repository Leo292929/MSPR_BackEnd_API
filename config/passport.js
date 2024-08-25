const LocalStrategy = require('passport-local').Strategy;
const { connection } = require('./database');

module.exports = function(passport) {
    // Configuration de la stratégie locale pour Passport
    passport.use(new LocalStrategy(
        function(username, password, done) {
            connection.query('SELECT * FROM Utilisateur WHERE nomUser = ?', [username], (err, results) => {
                if (err) { return done(err); }
                if (results.length === 0) {
                    return done(null, false, { message: 'Nom d’utilisateur incorrect.' });
                }
                const user = results[0];
                if (user.mdpUser !== password) {  // En production, comparer les mots de passe hachés
                    return done(null, false, { message: 'Mot de passe incorrect.' });
                }
                return done(null, user);
            });
        }
    ));

    // Sérialisation de l'utilisateur pour la session
    passport.serializeUser((user, done) => {
        done(null, user.idUser);
    });

    // Désérialisation de l'utilisateur à partir de la session
    passport.deserializeUser((id, done) => {
        connection.query('SELECT * FROM Utilisateur WHERE idUser = ?', [id], (err, results) => {
            if (err) { return done(err); }
            done(null, results[0]);
        });
    });
};