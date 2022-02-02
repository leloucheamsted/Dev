const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
var validation = require('email-validator');
/*==============Signup =====================*/
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // cryptage du mot de passe
        .then(hash => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            /* ======= VALIDATION DU MAIL =========== */
            if (validation.validate(req.body.email)) {
                console.log('Mail valider');
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            }
            else {
                console.log('Mail non valider');
            }
        })

        .catch(error => res.status(500).json({ error }));
};

/*==============Login =====================*/
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        // CREATION DU TOKEN AVEC JSONWEBTOKEN
                        token: jwt.sign( // utilisation de sign pour encoder le token
                            { userId: user._id }, //  user Id pour etre sur que la requete vient du user
                            'RANDOM_TOKEN_SECRET',  // cle secrete de l'encodage
                            { expiresIn: '24h' } // temps d'expiration du token
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

