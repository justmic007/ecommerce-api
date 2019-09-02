const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const logger = require('morgan');

const app = express();

const productRoutes = require('./routes/products');
const oderRoutes = require('./routes/orders');

app.use(logger('dev'));

//Routes that handles requests
app.use('/products', productRoutes);
app.use('/orders', oderRoutes);

// Handle errors that passes the routes above
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;
