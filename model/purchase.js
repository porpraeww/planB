var mongoose = require("mongoose");

let PurchaseInfo = new mongoose.Schema({
    usr : String,
    number : String,
    qty : Number,
    t : Number,
    orderTime : Date
  })
  
module.exports = mongoose.model("purchase", PurchaseInfo);