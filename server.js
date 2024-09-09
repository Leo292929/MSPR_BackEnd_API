const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const routes = require('./routes');
const { connectToDatabase } = require('./config/database');
require('./config/passport')(passport); // Configuration de Passport
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

// Connexion à la base de données
connectToDatabase();

// Configuration des sessions
const sessionStore = new MySQLStore({}, require('./config/database').connection);
app.use(session({
    secret: 'votre_secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));




// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialiser Passport
app.use(passport.initialize());
app.use(passport.session());

// Utilisation des routes centralisées
app.use('/api', routes);

// Route par défaut pour servir la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Une erreur est survenue sur le serveur.');
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;