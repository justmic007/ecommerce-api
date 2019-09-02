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

module.exports = app;
