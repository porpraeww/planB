var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var mongoDB = 'mongodb://localhost:27017/PlanB';
var multer = require('multer');
var path = require('path');

const storage = multer.diskStorage({
  destination: './public/lotteriesData',
  filename: function(req, res, cb){
    cb(null, file.fieldname + '-' +  Date.now() + path.extname(file.originalname));
  }
});

//ฟังก์ชันอัพโหลด image
const imageFilter = function(req, file, cb){
  var ext = path.extname(file.originalname);
  if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg'){
    return cb(new Error('Only Image is allowed'), false);
  }
  cb(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFilter});

let LotterySchema = new mongoose.Schema({
	number : String,
	image : String,
	price : String,
  discount : String,
  remaining : Number
});

let lot = mongoose.model("lotteries", LotterySchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing');
});

router.get('/blogs', function(req, res, next) {
  //เลือกเฉพาะล็อตเตอรี่ที่มีจำนวนเหลือมากกว่า 0
  lot.find({remaining:{ $gt: 0 }},function(err, all){
    if(err){
        throw err;
    }
    else
    {
        res.render("shop",{ Lottery : all});
    }
  })
});

router.get("/search",async function(req, res)
{
  let key = req.query.keyword;
  const result = await lot.find({number:{ $regex: key }});
  console.log(result);
  res.render("shop",{Lottery : result, key : key});
});

router.get('/blog/lotId=:id', async function(req, res, next) {
  const { id } = req.params;
  const product = await lot.findById(id);
  res.render("details",{ l : product });
});

//รับข้อมูล id ลงตะกร้า
router.post('/cart/', function(req, res){
  var lot_id = req.body.lot_id;
  var lot_qty = req.body.qty;
  //ถ้ามี session อยู่แล้วให้เพิ่ม ถ้าไม่มีให้สร้าง session เปล่า
  req.session.cart = req.session.cart || {};  
  var cart = req.session.cart; //ตะกร้า
  lot.find({ _id : lot_id },function(err, all){
    if(err){
      console.log(err);
    }
    else
    {
      //ซื้อซ้ำ
      if(cart[lot_id]){
        var new_value = parseInt(lot_qty);
        var cart_value = parseInt(cart[lot_id].qty);
        cart[lot_id].qty = new_value + cart_value;
      }
      //ซื้อครั้งแรก
      else{
        all.forEach(function(l){
          cart[lot_id] = {
          item : l._id,
          number : l.number,
	        price : parseInt(l.price),
          qty : parseInt(lot_qty)
        }});
        }
    }
      res.redirect("/cart");
    })
});

router.get('/cart', function(req, res){
  var cart = req.session.cart; //ตะกร้า
  var displayCart = { items:[], total:0 };
  var total = 0;
  for(item in cart){
    displayCart.items.push(cart[item]);
    total += cart[item].qty * cart[item].price;
  }
  displayCart.total = total;
  res.render("cart", {cart : displayCart});
});

router.get('/lotcheck', function(req, res, next) {
  res.render('lotcheck');
});

router.get('/game', function(req, res, next) {
  res.render('game');
});

router.get('/pay', function(req, res, next) {
  res.render('pay');
});

module.exports = router;
