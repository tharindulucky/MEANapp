const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');

const authentication = require('./routes/authentication')(router);

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

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/client/dist/'));
app.use('/authentication', authentication);

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname+'/client/dist/index.html'));
});

app.listen(port, () => {
    console.log("Listening on port "+port);
});