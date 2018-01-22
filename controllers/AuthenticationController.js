const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/users');


exports.checkAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token){
        res.json({success: false, message: 'No token provided'});
    }else{
        jwt.verify(token, config.secret, (err, decoded) => {
            if(err){
                res.json({success: false, message: 'Invalid token. ' + err});
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }
}


exports.registerUser = (req, res) => {
    if(!req.body.name){
        res.json({success: false, msg: 'Please include name'});
    }else if(!req.body.username){
        res.json({success: false, msg: 'Please include username'});
    }else if(!req.body.email){
        res.json({success: false, msg: 'Please include email'});
    }else if(!req.body.password){
        res.json({success: false, msg: 'Please include password'});
    }else{
        let user = new User({
            name: req.body.name,
            username: req.body.username.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: req.body.password
        });

        user.save((err) => {
            if(err){
                if(err.code == 11000){
                    res.json({success: false, message: 'Username or email already exists'});
                }else{
                    if(err.errors){
                        if(err.errors.email){
                            res.json({success: false, message: err.errors.email.message});

                        }else if(err.errors.username){
                            res.json({success: false, message: err.errors.username.message});

                        }else if(err.errors.password){
                            res.json({success: false, message: err.errors.password.message});
                        }else{
                            res.json({success: false, message: 'Fatal Error'+err});
                        }
                    }else{
                        res.json({success: false, message: 'User not saved', err});
                    }
                }
            }else{
                res.json({success: true, message: 'User saved'});
            }
        });
    }
}


exports.loginUser = (req, res) => {
    if(!req.body.email){
        res.json({success:false, message: 'No email provided'});
    }else{
        if(!req.body.password){
            res.json({success:false, message: 'No password provided'});
        }else{
            User.findOne({email: req.body.email.toLowerCase()}, (err, user) => {
                if(err){
                    res.json({success: false, message: err});
                }else{
                    if(!user){
                        res.json({success: false, message: 'User not found!'});
                    }else{
                        if(!user.comparePassword(req.body.password)){
                            res.json({success: false, message: 'Incorrect Password!'});
                        }else{
                            const token = jwt.sign({userId: user._id}, config.secret, {expiresIn:'24h'});
                            res.json({success: true, message: 'Success', token: token, user: {username: user.username, email:user.email}});
                        }
                    }
                }
            });
        }
    }
}


exports.getProfile = (req, res) => {
    console.log(req);
    User.findOne({_id: req.decoded.userId}).select('name username email').exec((err, user) => {
        if(err){
            res.json({success: false, message: err});
        }else{
            if(!user){
                res.json({success: false, message: 'User not found'});
            }else{
                res.json({success: true, user: user});
            }
        }
    });
}


exports.checkEmail = (req, res) => {
    if(!req.params.email){
        res.json({success: false, message: 'No email provided'});
    }else{
        User.findOne({
            email: req.params.email
        }, (err, user) => {
            if(err){
                res.json({success: false, message: err});
            }else{
                if(user){
                    res.json({success: false, message: 'Email already taken!'});
                }else{
                    res.json({success: true, message: 'Email available!'});
                }
            }
        })
    }
}


exports.checkUsername = (req, res) => {
    if(!req.params.username){
        res.json({success: false, message: 'No username provided'});
    }else{
        User.findOne({
            username: req.params.username
        }, (err, user) => {
            if(err){
                res.json({success: false, message: err});
            }else{
                if(user){
                    res.json({success: false, message: 'Username already taken!'});
                }else{
                    res.json({success: true, message: 'Username available!'});
                }
            }
        })
    }
}