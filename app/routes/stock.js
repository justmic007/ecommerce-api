const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware-auth/check-auth');
// const Product = require('../models/products');

const StockController = require('../controllers/stock');


router.post('/', checkAuth, StockController.stockPOST);

router.get('/', StockController.stockGetAll);

router.get(`/:stockUUID`, StockController.stockGetOne);

router.put('/:stockUUID', checkAuth, StockController.stockUpdateOne);

router.delete('/:stockUUID', checkAuth, StockController.stockDeleteOne);

module.exports = router;