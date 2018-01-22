const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Ad = require('../models/ad');

exports.saveAd = (req, res) => {

    if(!req.body.title){
        res.json({success:false, message: 'Please include ad title'});
    }else if(!req.body.description){
        res.json({success:false, message: 'Please include ad description'});
    }else{
        const ad = new Ad({
            title: req.body.title,
            description: req.body.description,
            author: req.decoded.userId,
            date: '2017-12-21'
        });

        ad.save((err) => {
            if(err){
                if(err.errors.title){
                    res.json({success:false, message: err.errors.title.message});
                }else if(err.errors.description){
                    res.json({success:false, message: err.errors.description.message});
                }else{
                    res.json({success:false, message: 'Fatal Erro'+err});
                }
            }else{
                res.json({success:true, message: 'Ad saved!'});
            }
        });
    }
}