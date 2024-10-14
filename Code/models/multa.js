// Modello multa utente
const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
    mail: {type: String, required : true},
    importo: {type: Number, required: true},
    paga_entro: {type: Date, required: true},
})

const Multa = mongoose.model("Multa", schema);
module.exports = Multa;