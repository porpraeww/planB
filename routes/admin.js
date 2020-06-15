var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var mongoDB = 'mongodb://localhost:27017/PlanB';
var path = require('path');
var multer = require('multer');
var moment = require("moment");
var LocalStrategy = require("passport-local").Strategy;
var lot = require("../model/lottery");
var prize = require("../model/prize");
var User = require("../model/users");
var winner = require("../model/winner");
var purchase = require("../model/purchase");

const { compileClientWithDependenciesTracked } = require('jade');

const storage = multer.diskStorage({
  destination: './public/lotteriesData',
  filename: function(req, file, cb){
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

const storage2 = multer.diskStorage({
  destination: './public/transferData',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' +  Date.now() + path.extname(file.originalname));
  }
});

const upload2 = multer({storage: storage2, fileFilter: imageFilter});

  router.get('/', isAdmin, function(req, res, next) {
    res.render("homepage.ejs");
  });

  router.get('/add', isAdmin, function(req, res, next) {
    lot.find({remaining:{ $gt: 0 }},function(err, all){
      if(err){
          throw err;
      }
      else
      {
        res.render("add",{ Lottery : all});
      }
    })
  });

  router.get('/addLot', isAdmin, function(req, res, next) {
    res.render('addLot');
  });

  router.get('/lotday', isAdmin, function(req, res, next) {
    prize.find({}, function(err, all){
      if(err) throw err;
      else{
        res.render('lotday', {Prize : all});
      }
    });
  });

  router.get('/status', isAdmin, function(req, res, next) {
    winner.find({}, function(err, all){
      if(err) console.log(err);
      else{
        res.render('status', {Winner : all, m : moment});
      }
    })
  });

router.post("/transfer/:id", upload2.single('trans'), function(req, res){
  let t_id = req.params.id;
  winner.findByIdAndUpdate({_id: t_id}, {status: true, image: req.file.filename}, function(err, transfered){
    if(err) console.log(err);
    else{
      res.redirect('/admin/status');
    }
  })
});

router.post("/add", upload.single('lot_image'), function(req, res) {
  let n_num = req.body.number;
  let n_img = req.file.filename;
  let n_price = req.body.price;
  let n_discount = req.body.discount;
  let n_date = req.body.date;
  let n_remain = req.body.remain;
  let n_lot = new lot({number:n_num, image:n_img, price:n_price, discount:n_discount, t:n_date, remaining: n_remain});
  lot.create(n_lot, function(err, newlot){
    if(err) throw err;
    else{
      //สำเร็จ
      res.redirect("/admin/addLot");
    }
  })
});

router.post("/deleteLot=:id", isAdmin, function(req, res){
  let lotId = req.params.id;
  lot.deleteOne({_id : lotId}, function(err, del){
    if(err) throw err;
    else{
      res.redirect("/admin/add");
    }
  })
});

router.post("/deletePrize=:id", isAdmin, function(req, res){
  let prizeId = req.params.id;
  prize.findOne({_id: prizeId}, function(err, delprize){
    winner.deleteMany({number: {$regex: new RegExp( delprize.number + '$')}, t: delprize.t, rank: delprize.rank}, function(err, del){
      if(err) console.log(err);
    })
  })
  prize.deleteOne({_id : prizeId}, function(err, del){
    if(err) throw err;
    else{
      res.redirect("/admin/lotday");
    }
  })
});

router.post("/prize", isAdmin, function(req, res){
  let n_date = req.body.t;
  let n_rank = req.body.rank;
  let n_number = req.body.number;
  let n_prize = req.body.prize;
  let n_t = req.body.t;
  let n_prizes = ({rank: n_rank, t: n_date, number: n_number, prize: n_prize, t: n_t});
  prize.create(n_prizes, function(err, del){
    if(err) console.log(err);
  })
  //หาเลขลงท้าย
  purchase.find({number: {$regex: new RegExp( n_number + '$')}, t: n_date}, function(err, purchased){
    if(err) console.log(err);
    else{
      purchased.forEach(element =>{ 
        let n_usr = element.usr;
        let n_orderTime = element.orderTime;
        let n_num = element.number;
        let n_winner = {usr:n_usr, number:n_num, t:n_date, rank:n_rank, prize:n_prize, orderTime: n_orderTime, status:false, image:"#"}
        winner.create(n_winner, function(err, won){
          if(err) console.log(err);
        })
      })
    }
  })
  res.redirect("/admin/lotday");
});

  function isAdmin(req, res, next){
    var user = req.user;
    if(user.admin){
      return next();
    }
    else{
      res.redirect("/");
    }
  }

module.exports = router;