const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

/*
Email validators
 */

let emailLengthchecker = (email) => {
    if(!email){
        return false;
    }else{
        if(email.length < 5 || email.length > 30){
            return false;
        }else{
            return true;
        }
    }
};

let validEmailChecker = (email) => {
    if(!email){
        return false;
    }else{
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const regExp = new RegExp(re);
        return regExp.test(email);
    }
};



/*
Username validators
 */

let usernameLengthChecker = (username) => {
    if(!username){
        return false;
    }else{
        if(username.length < 3 || username.length > 15){
            return false;
        }else{
            return true;
        }
    }
};

let validUsernameChecker = (username) => {
    if(!username){
        return false;
    }else{
        var re2 = /^[a-zA-Z0-9]+$/;
        const regExp2 = new RegExp(re2);
        return regExp2.test(username);
    }
};



/*
password validators
 */

let passwordLengthChecker = (password) => {
    if(!password){
        return false;
    }else{
        if(password.length < 6 ){
            return false;
        }else{
            return true;
        }
    }
}


const emailValidators = [
    {validator: emailLengthchecker, message: 'Email length must be between 5 to 30 characters'},
    {validator: validEmailChecker, message: 'Invalid email'}
];

const usernameValidators = [
    {validator: usernameLengthChecker, message: 'Username length must be between 3 to 15 characters'},
    {validator: validUsernameChecker, message: 'Invalid username'}
];

const passwordValidators = [
    {validator: passwordLengthChecker, message: 'Password must be at least 6 characters long'}
]

const userSchema = new Schema({
    name: {type: String},
    username: {type: String, required: true, unique: true, lowercase: true, validate: usernameValidators},
    email: {type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
    password: {type: String, required: true, validate: passwordValidators}
});

userSchema.pre('save', function (next) {
    if(!this.isModified('password')){
        return next();
    }else{
        bcrypt.hash(this.password, null, null, (err, hash) => {
            if(err) return next(err);
            this.password = hash;
            next();
        });
    }
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);