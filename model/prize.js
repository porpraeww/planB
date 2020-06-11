var mongoose = require("mongoose");

let PrizeSchema = new mongoose.Schema({
    rank : String,
    t : Number,
    number : String,
    prize : Number
  });
  
  module.exports = mongoose.model("prizes", PrizeSchema);