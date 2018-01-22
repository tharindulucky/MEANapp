const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb://localhost:27017/mean_app3',
    secret: crypto,
    db: 'mean_app3'
}