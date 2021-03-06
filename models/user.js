var mongoose = require('mongoose');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var crypto = require('crypto');



// user schema field 

var UserSchema = new mongoose.Schema({

    email: {

        type: String,
        unique: true,
        lowercase:true
    },

    password: String,


    profile:{
        name : {type:String, default: ''},
        picture: {type:String, default:''}
    },


    address: String,
    history:[{
        date:Date,
        paid:{type: Number , default:0}
        // item:{type: Schema.Types.ObjectId, ref: ''}
    }]

});

// password hashing 

UserSchema.pre('save', function(next){

    var user = this; 
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10,function(err, salt){

        if(err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err,hash){

            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});




// create password in the database and testing matching  with the one the User types in


UserSchema.methods.comparePassword = function(password){

    return bcrypt.compareSync(password, this.password);

};

UserSchema.methods.gravatar = function(size){
    if(!this.size) size = 200;
    if(!this.email) return 'https://gravatar.com/avatar/?' + size + '$d=retro';
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '$d=retro';
}



module.exports = mongoose.model('User', UserSchema);


  
