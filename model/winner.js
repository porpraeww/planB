var mongoose = require("mongoose");

let WinnerSchema = new mongoose.Schema({
    usr : String,
    number : String,
    t : Number,
    rank : String,
    prize : Number,
    status : Boolean
  });
  
  module.exports = mongoose.model("winners", WinnerSchema);