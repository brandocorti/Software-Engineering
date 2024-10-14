const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
  id: {type: String},
  seq: {type: Number},
});

const Counter = mongoose.model("Counter", schema);
module.exports = Counter;