const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
    // Create a product
    const product = {
        productName: req.body.productName,
        price: req.body.price,
        serialNumber: req.body.serialNumber,
        productSKU: req.body.productSKU,
        brand: req.body.brand,
        model: req.body.model,
        category: req.body.category,
        manufacturer: req.body.manufacturer,
        description: req.body.description
    };
    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    });
});

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        })
    } else {
        res.status(200).json({
            message: 'You passed an ID',
        })
    }
});

router.put('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product!'
    })
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product!'
    })
})



module.exports = router;