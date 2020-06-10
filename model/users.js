//this is model
var mongoose = require("mongoose");
var mongoDB = 'mongodb://localhost:27017/PlanB';
var bcrypt = require('bcryptjs');
var cron = require('node-cron');

mongoose.connect(mongoDB, {useNewUrlParser: true,useUnifiedTopology: true});

//connect DB
var db = mongoose.connection;
db.on("error", console.error.bind(console, "DB error"));

var UserSchema = mongoose.Schema({
	usr : String,
	pwd : String,
    email : String,
    acc : {type: Number},
    accname : String,
    bank : String,
    game : Number,
    fragment : Number,
    admin : Boolean
});

var User = module.exports = mongoose.model("User", UserSchema);
module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.pwd, salt, function(err, hash) {
            // Store hash in your password DB.
            newUser.pwd = hash;
            newUser.save(callback);
        });
    }); 
};

//ค้นหา user ในระบบจาก id
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}
module.exports.getUserByName = function(username, callback) {
    var query = {
      usr: username
    };
    User.findOne(query, callback);
}
//เปรียบเทียบรหัสผ่าน
module.exports.comparePassword = function(password, hash, callback) {
    bcrypt.compare(password, hash, function(err, isMatch){
        callback(null, isMatch);
    });
}

cron.schedule('0 0 * * *', () => {
    User.updateMany({}, {game: 1}, function(err, gameSet){
        if(err) throw err;
     })
        , {
    scheduled: true,
    timezone: "Asia/Bangkok"
    }
    });