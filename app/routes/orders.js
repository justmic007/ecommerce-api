const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
    // Create an order
    const order = {
        productUUID: req.body.productUUID,
        // productName: req.body.productName,
        // price: req.body.price,
        // serialNumber: req.body.serialNumber,
        // productSKU: req.body.productSKU,
        // brand: req.body.brand,
        // model: req.body.model,
        quantity: req.body.quantity
        // category: req.body.category,
        // manufacturer: req.body.manufacturer,
        // description: req.body.description
    };
    order
        .save()
        .then(payload => {
            console.log(payload);
            res.status(201).json({
                message: 'Handling POST requests to /orders',
                createdProduct: order
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});


module.exports = router;
