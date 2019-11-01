const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware-auth/check-auth');
// const Order = require('../models/orders');
const OrdersController = require('../controllers/orders');

router.post('/', checkAuth, OrdersController.ordersPOST );

router.get('/', checkAuth, OrdersController.ordersGetAll );

router.get('/:orderUUID', checkAuth, OrdersController.ordersGetOne );

router.put('/:orderUUID', checkAuth, OrdersController.ordersUpdateOne );

router.delete('/:orderUUID', checkAuth, OrdersController.ordersDeleteOne );


module.exports = router;
