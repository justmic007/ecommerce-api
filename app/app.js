// import express from 'express';
// import bodyParser from 'body-parser';
// import logger from 'morgan';
const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const logger = require('morgan');

const app = express();

const productRoutes = require('./routes/products');
const oderRoutes = require('./routes/orders');

// Logger to console
app.use(logger('dev'));

// Extracting bodies of in-coming requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes that handles requests
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
