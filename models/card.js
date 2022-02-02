const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const card = require('./card');
const CardSchema = mongoose.Schema({
    walletId: { type: String, required: true, unique: true }, // Un utilisateur ne peut creer q'un seul portefeuille
    cvc: { type: String, require: true },
    number: { type: String, required: true },
    exp_month: { type: Number, require: true },
    exp_year: { type: Number, require: true },
});

CardSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Card', CardSchema);