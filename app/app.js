const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const productRoutes = require('./routes/products');
const stockRoutes = require('./routes/stock');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/carts');
const userRoutes = require('./routes/users');

const app = express();

mongoose.set('useCreateIndex', true);

mongoose.connect(
  'mongodb://localhost:27017/ecommerceapp-products',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// Logger to console
app.use(logger('dev'));
app.use(cors());
app.use(helmet());

// Makes uploads folder publicly available
app.use('/uploads', express.static('uploads'));

// Extracting bodies of in-coming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes that handles requests
app.use('/stock', stockRoutes);
app.use('/products', productRoutes);
// app.use('/products/:{uuid}', productRoutes);
app.use('/orders', orderRoutes);
app.use('/carts', cartRoutes);
app.use('/users', userRoutes);

// Handle errors that passes the routes above
app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app;
