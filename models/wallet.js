const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const card = require('./card');
const walletSchema = mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Un utilisateur ne peut creer q'un seul portefeuille
    amount: { type: Number },
    pin: { type: String, required: true }
});

walletSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Wallet', walletSchema);