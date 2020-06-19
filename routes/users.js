//this is router
var express = require('express');
var moment = require("moment");
var router = express.Router();
const {check, validationResult} = require("express-validator");
var User = require("../model/users");
var purchase = require("../model/purchase");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

/* GET users listing. */
router.get('/', enSureAuthenticated, function(req, res, next) {
  res.render("landing.ejs");
});

router.get('/editpro', function(req, res, next) {
  res.render('editpro');
});

router.get('/editmoney', function(req, res, next) {
  res.render('editmoney');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/history', function(req, res){
  if(req.user){
    let user = req.user.usr;
    purchase.find({usr: user}, function(err, hist){
      if(err) console.log(err);
      else{
        res.render("history", {hist : hist, m : moment});
      }
    })
  }
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

//รับข้อมูล register
router.post('/register',[
  check("email", "อีเมลไม่ถูกต้อง").isEmail(),
  check("usr", "กรุณาป้อนชื่อผู้ใช้งาน").not().isEmpty(),
  check("pwd", "กรุณาป้อนรหัสผ่าน").not().isEmpty(),
  check("repwd", "กรุณาป้อนรหัสผ่านอีกครั้ง").not().isEmpty(),
  check("acc", "กรุณาป้อนเลขที่บัญชีให้ถูกต้อง").isInt(),
  check("accname", "กรุณาป้อนชื่อบัญชี").not().isEmpty(),
], function(req, res, next) {
  const result = validationResult(req);
  var errors = result.errors;
  //เช็คว่าป้อนถูกไหม
  if(!result.isEmpty()){
    res.render("register", {errors : errors});
  }
  //ส่งข้อมูลลง DB
  else{
    var n_usr = req.body.usr;
    var n_pwd = req.body.pwd;
    var re_pwd = req.body.repwd;
    var n_email = req.body.email;
    var n_acc = req.body.acc;
    var n_accname = req.body.accname;
    var n_bank = req.body.bank;
    var newUser = new User({usr:n_usr,pwd:n_pwd,email:n_email,acc:n_acc,accname:n_accname,bank:n_bank,game:1,fragment:0,admin:false});
    if(n_pwd === re_pwd){
      User.findOne({usr:n_usr}, function(err, user){
        if(err) throw err;
        if(!user){
          User.createUser(newUser,function(err,newdata){
            if(err){
              console.log(err);
            }
            else{
              res.location("/");
              res.redirect("/");
            }
          })
        }
        else res.render("register");
      })
    }
    else res.render("register");
  }    
});

router.post('/login', passport.authenticate("local",{
  //ถ้า fail ให้กลับไปหน้าregister
  failureRedirect: "/users/register",
  failureFlash: false
}), isAdmin, function(req, res, next) {
  res.redirect("/");
});

passport.serializeUser(function(user, done){
  //ถ้า fail return null ถ้า success จะได้ user.id
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
    done(err, user);
  });
});

//หา username
passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByName(username, function(err, user){
    if(err) throw error;
    if(!user){
      //ไม่พบผู้ใช้งาน
      return done(null, false);
    }
    else
    { 
      //อีเมลล์ถูกต้อง แล้วค่อยเปรียบเทียบ password
      User.comparePassword(password,user.pwd,function(err,isMatch)
      {
        if(isMatch)
        {
          //รหัสผ่านถูกต้อง
          //return ออกไปเก็บ session ตัวแปร locals.user สามารถเรียกใช้งานได้ทั้งระบบ
          return done(null,user);
        }
        else
        {
          return done(null,false)
        }

      })
      //ส่งไปหา passport.serializeUser
    }
  });
}));

router.put('/editmoney', [], function(req, res, next){
  let n_acc = req.body.acc;
  let n_accname = req.body.accname;
  let n_bank = req.body.bank;
  let e_User = {acc:n_acc, accname:n_accname, bank:n_bank};
  User.findByIdAndUpdate(req.user, e_User, function(err, updatedUser){
    if(err) throw err;
    else{
      res.redirect('/');
    }
  })
});

function enSureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect("/");
  }
}

function isAdmin(req, res, next){
  var user = req.user;
  if(user.admin){
    res.redirect("/admin/");
  }
  else return next();
}


module.exports = router;
