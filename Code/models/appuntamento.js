const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
   mail: {type : String, required : true},
   data : {type : Date, required : true},
   tipo_app : {type : String, required : true},
})

const Appuntamento = mongoose.model("Appuntamento", schema);
module.exports = Appuntamento;