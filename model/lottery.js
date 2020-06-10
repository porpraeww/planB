var mongoose = require("mongoose");

let LotterySchema = new mongoose.Schema({
	number : String,
	image : String,
	price : String,
  discount : String,
  date : String,
  remaining : Number
});

module.exports = mongoose.model("lotteries", LotterySchema);