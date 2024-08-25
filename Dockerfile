# Étape 1 : Utiliser une image de base Node.js
FROM node:16

# Étape 2 : Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Étape 3 : Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Étape 4 : Installer les dépendances Node.js
RUN npm install

# Étape 5 : Copier le reste des fichiers de l'application
COPY . .

# Étape 8 : Exposer le port sur lequel l'application va écouter
EXPOSE 3000

# Étape 9 : Démarrer l'application
CMD ["node", "server.js"]