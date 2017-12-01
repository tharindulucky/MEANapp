const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');

const app = express();
const port = 3000;

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err){
        console.log('Database Connection Error', err);
    }else{
        console.log('Connected to Database', config.db);
    }
});

app.use(express.static(__dirname+'/client/dist/'))

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname+'/client/dist/index.html'));
});

app.listen(port, () => {
    console.log("Listening on port "+port);
});