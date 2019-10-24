const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');

const app = express();

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/carts');
const userRoutes = require('./routes/users');


mongoose.set( 'useCreateIndex', true );

mongoose.connect(
    'mongodb://localhost:27017/ecommerceapp-products',
    {
        useNewUrlParser: true
    }
);

// Logger to console
app.use(logger('dev'));

// Makes uploads folder publicly available
app.use('/uploads', express.static('uploads'));

// Extracting bodies of in-coming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handle CORS(i.e security mechanism used by the browser) errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Origin',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
})

// Routes that handles requests
app.use('/products', productRoutes);
// app.use('/products/:{uuid}', productRoutes);
app.use('/orders', orderRoutes);
app.use('/carts', cartRoutes);
app.use('/users', userRoutes);



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
