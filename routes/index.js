var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var mongoDB = 'mongodb://localhost:27017/PlanB';
var path = require('path');
var User = require("../model/users");
var lot = require("../model/lottery");

let PurchaseInfo = new mongoose.Schema({
  usr : String,
  number : String,
  qty : Number,
  date : Date,
  orderTime : Date
})

let purchase = mongoose.model("purchase", PurchaseInfo);

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
          qty : parseInt(lot_qty), 
          date : l.date
        }});
        }
    }
      res.redirect("/cart");
    })
});

router.post('/cart/deleteLotId=:id', function(req, res){
  var lot_id = req.params.id;
  if(req.session.cart){
    var cart = req.session.cart;
    cart[lot_id].qty = 0;
  }
  res.redirect('/cart');
});

router.post('/cart/deleteAll', function(req, res){
  if(req.session.cart){
    delete req.session.cart;
  }
  res.redirect('/cart');
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
  if(req.user){
    var user = req.user;
  User.findOne({_id: user.id}, function(err, thisUser){
    if(err) throw err;
    else{
      res.render('game', {thisUser: thisUser});
    }
    })
  }
  else{
    res.redirect("/users/register");
  }
});

router.post('/play', function(req, res, next){
  if(req.user){
    var user = req.user;
    User.updateOne({_id: user.id}, {game: 0}, function(err, thisUser){
      if(err) console.log(err);
    })
  }
  else{
    res.redirect("/users/register");
  }
});

router.post('/win', function(req, res, next){
  if(req.user){
    var user = req.user;
  User.update({_id: user.id}, {$inc:{fragment: 1}}, function(err, thisUser){
    if(err) throw err;
  })
  }
  res.redirect("/");
});

router.get('/pay', function(req, res, next) {
  res.render('pay');
});

router.post('/paid', function(req, res){
  var moment = require("moment");
  var now = moment().format("YYYY-MM-DDTHH:mm");
  var cart = req.session.cart;
  var user = req.user;
  var userUsr = user.usr;
  for(item in cart){
    var lotNum = cart[item].number;
    var lotQty = cart[item].qty;
    var lotDate = cart[item].date;
    var newOrder = new purchase({usr:userUsr, number: lotNum, qty: lotQty, date: lotDate, orderTime: now});
    purchase.create(newOrder, function(err, pched){
      if(err){
        delete req.session.cart;
        res.render("failurePurchased");
        throw err;
      }
      else {
        lot.findOne({number: lotNum, date: lotDate}, function(err, l){
          if(err){
            throw err;
          } 
          else{
            lot.updateOne({number: lotNum, date: lotDate}, {remaining: l.remaining - lotQty}, function(err, reduced){
              if(err){
                throw err;
              } 
            })
          }
        })
        
      }
    })
    delete req.session.cart;
    res.render("finishedPurchased");
  }
});




module.exports = router;
