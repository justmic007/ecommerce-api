const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware-auth/check-auth');

const CartsController = require('../controllers/carts');

router.post('/', checkAuth, CartsController.cartsPOST);

router.get('/', checkAuth, CartsController.cartsGetAll);

router.get(`/:productUUID`, checkAuth, CartsController.cartsGetOne);

router.put('/:productUUID', checkAuth, CartsController.cartsUpdateOne);

router.delete('/:productUUID', checkAuth, CartsController.cartsDeleteOne);

module.exports = router;
