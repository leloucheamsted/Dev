const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const DepotSchema = mongoose.Schema({
    Id_card: { type: String, required: true, unique: true }, // Un utilisateur ne peut creer q'un seul portefeuille
    cvc: { type: String, require: true },
    pin_code: { type: String, require: true },
});

DepotSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Depot', DepotSchema);