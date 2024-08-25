const mysql = require('mysql');

// Configuration de la connexion à la base de données MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'host.docker.internal',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'mspr61'
});

// Fonction de connexion à la base de données
const connectToDatabase = () => {
    connection.connect((err) => {
        if (err) {
            console.error('Erreur de connexion à la base de données : ', err);
            process.exit(1);
        }
        console.log('Connecté à la base de données MySQL');
        
    });
};


module.exports = {
    connection,
    connectToDatabase
};