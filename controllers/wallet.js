const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Wallet = require('../models/Wallet');
const card = require('../models/card');
const user = require('../models/User');
const Depot = require('../models/depot');
const stripe = require('stripe')('sk_test_51KOPxGEv2rgYV40gup25Ywyyl9qpkOS1teXIbuO8pNK3xvpWohyEeenx5CNw47SARTiTi8Mcys3lPpWUZjqmQovu00sjDAxQv0', {
    apiVersion: '2020-08-27',
});
const wallet = require('../models/card.js')

/*==============Create wallet =====================*/
exports.createWallet = (req, res, next) => {
    // cryptage du code pin
    bcrypt.hash(req.body.pin, 10).then(hash => {
        const wallet = new Wallet({
            userId: req.body.userId,
            balance: 0,
            card: [],
            pin: hash,
        });
        wallet.save()
            .then(() => res.status(201).json({ message: 'Portefeuille crée' }))
            .catch(error => res.status(400).json({ error }));
    })
}

/*==============AddCard =====================*/
exports.AddCard = (req, res, next) => {

    // cryptage du code a 3 chiffres

    bcrypt.hash(req.body.cvc, 10).then(hash => {
        const Card = new card({
            walletId: req.params.id,
            number: req.body.number,
            exp_month: req.body.exp_month,
            exp_yeah: req.body.exp_month,
            cvc: hash,
        });
        Card.save()
            .then(() => res.status(201).json({ message: 'Carte ajouter' }))
            .catch(error => res.status(400).json({ error }));
    })
}

/*==============deposit =====================*/

exports.deposit = (req, res, next) => {

    card.findOne({ _id: req.params.id })
        .then((result) => {
            Wallet.findOne({ _id: result.walletId }) // recuparation de l'id du portefeulle
                .then((wallet) => {
                    // si le code pin est verifier
                    if (wallet.pin == req.body.pin_code) {
                        // Depot stripe
                        stripe.paymentMethods.create({
                            type: 'card',
                            card: {
                                number: result.number,
                                exp_month: result.exp_month,
                                exp_year: result.exp_year,
                                cvc: result.cvc,
                            },
                        })
                        stripe.paymentIntents.create({
                            amount: req.body.amount,
                            currency: 'cad',
                            payment_method_types: [card],
                        }).then((s) => {
                            console.log("Succes");
                        })
                    }
                }

             ,)
        })
}

/*==============Trasnfert =====================*/
exports.transfert = (req, res, next) => {
    var amount = 0;
    //Recuperation du montant compte debiteur
    user.findOne({ _id: req.params.id }).then((userPay) => {
        amount = userPay.amount;
        userPay.amount = 0;
        console.log(userPay)
    })
    //Transfert compte crediteur
    user.findOne({ _id: req.body.id }).then((use) => {
        if (!use) {
            return res.status(401).json({ error: 'Compte non trouvé !' });
        }
        // Recherche d portefeuille
        Wallet.findOne({ userId: req.body.id }).then((wallet) => {
            amount += wallet.amount;
            Wallet.updateOne({ userId: wallet.userId }, { amount: amount })
            console.log('Transfert effectuer')
        }).then(r => res.status(200).json({ "Message": "Transfert Effectuer" })).catch(e => res.status(500).json(e))
    }).catch(e => res.status(500).json({ e }))
}