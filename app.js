const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();


// global configuration parameters
app.set('view engine', 'pug'); // add template engine
app.set('views', 'views'); // add default template folder


// local routes and local func
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');


// POST routes parsing
app.use(bodyParser.urlencoded({extended: false}));

// load static files
app.use(express.static(path.join(__dirname, 'public')));


// add admin route
app.use('/admin', adminData.routes);

// add shop routes
app.use(shopRoutes);

// add auto load 404 route
app.use('/', (req, res) => {
    res
    .status(404)
    .render('404.pug', {docTitle: 'Page not found'});
});


app.listen(8050);