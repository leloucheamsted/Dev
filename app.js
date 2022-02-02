const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const userRouter = require('./routes/user.js')
const walletRouter = require('./routes/wallet')
const path = require('path');
const app = express()
mongoose.connect('mongodb+srv://Lelouche:Cabraule1999@cluster0.gnuhx.mongodb.net/NanoTestDB?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
/*
Ajout du systeme de securite par defaut 
*/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Parser 
// body-parser va transformer le corps de la requete en fichier javascript utilisable
app.use(bodyParser.json());
// app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/wallet', walletRouter);
app.use('/api/auth', userRouter);

module.exports = app // Pour pouvoir utiliser le fichier aps