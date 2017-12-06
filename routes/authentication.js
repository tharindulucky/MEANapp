const User = require('../models/users');

module.exports = (router) => {

    router.post('/register', (req, res) => {
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
    });

    return router;
}