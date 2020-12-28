const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();


// add local routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


//add POST routes parsing
app.use(bodyParser.urlencoded({extended: false}));

//add load static files
app.use(express.static(path.join(__dirname, 'public')));


// add admin route
app.use('/admin', adminRoutes);

// add shop routes
app.use(shopRoutes);

// add auto load 404 route
app.use('/', (req, res) => {
    res
    .status(404)
    .sendFile(path.join(__dirname, 'views', '404.html'));
});


app.listen(8080);