var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var mongoDB = 'mongodb://localhost:27017/PlanB';
var path = require('path');
var multer = require('multer');
var LocalStrategy = require("passport-local").Strategy;
var lot = require("../model/lottery");

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
    res.render('lotday');
  });
  router.get('/status', isAdmin, function(req, res, next) {
    res.render('status');
  });

router.post("/add", upload.single('lot_image'), function(req, res) {
  let n_num = req.body.number;
  let n_img = req.file.filename; console.log(n_img);
  let n_price = req.body.price;
  let n_discount = req.body.discount;
  let n_date = req.body.date;
  let n_remain = req.body.remain;
  let n_lot = new lot({number:n_num, image:n_img, price:n_price, discount:n_discount, date:n_date, remaining: n_remain});
  lot.create(n_lot, function(err, newlot){
    if(err) throw err;
    else{
      //สำเร็จ
      res.redirect("/admin/addLot");
    }
  })
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