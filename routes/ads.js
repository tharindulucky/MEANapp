const User = require('../models/users');
const Ad = require('../models/ad');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const AdController = require('../controllers/AdController');

module.exports = (router) => {
    router.post('/new', AdController.saveAd);

    return router;
}