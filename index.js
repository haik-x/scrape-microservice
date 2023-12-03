const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');


const routes = require('./routes');

const app = express();


app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const port = process.env.PORT || 4000;


app.use(routes);


const mongoUrl = 'mongodb+srv://temp_user:12345@cluster0.lubpf6e.mongodb.net/web_scraper?retryWrites=true&w=majority';

mongoose.connect(mongoUrl).then(() => {
    app.listen(port, () => {
        console.log('app is running...');
    });
}).catch(err => {
    console.log('Could not connect', err);
});
