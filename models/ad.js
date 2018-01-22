const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;


/*
 valid content checker
 */
let validContentChecker = (content) => {
    if(!content){
        return false;
    }else{
        var re2 = /^[a-zA-Z0-9.,' ]+$/;
        const regExp2 = new RegExp(re2);
        return regExp2.test(content);
    }
};




/*
 Title length validator
 */
let titleLengthchecker = (content) => {
    if(!content){
        return false;
    }else{
        if(content.length < 6 || content.length > 30){
            return false;
        }else{
            return true;
        }
    }
};


/*
 Desc length validator
 */
let descLengthchecker = (content) => {
    if(!content){
        return false;
    }else{
        if(content.length < 20 || content.length > 300){
            return false;
        }else{
            return true;
        }
    }
};


/*
 Comment length validator
 */
let commentLengthchecker = (content) => {
    if(!content){
        return false;
    }else{
        if(content.length < 20 || content.length > 300){
            return false;
        }else{
            return true;
        }
    }
};


const titleValidators = [
    {validator: titleLengthchecker, message: 'Ad title length must be between 6 to 30 characters'},
    {validator: validContentChecker, message: 'Invalid title'}
];

const descriptionValidators = [
    {validator: descLengthchecker, message: 'Ad title length must be between 20 to 300 characters'},
    {validator: validContentChecker, message: 'Invalid ad content'}
];

const commentValidators = [
    {validator: commentLengthchecker, message: 'Comment length must be between 5 to 30 characters'},
    {validator: validContentChecker, message: 'Invalid comment content'}
];

const adSchema = new Schema({
    title: {type: String, required: true, validate: titleValidators},
    description: {type: String, required: true, validate: descriptionValidators},
    author: {type: String, required: true,},
    date: {type: Date, required: true},
    likedBy: {type: Array},
    dislikedBy: {type: Array},
    comments: [
        {
            comment: {type: String, validate:commentValidators},
            commentBy: {type: String},
            date: {type: Date, required: true},
        }
    ]
});

module.exports = mongoose.model('Ad', adSchema);