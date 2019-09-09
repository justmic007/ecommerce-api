const express = require('express');
const router = express.Router();
// const uuid = require('uuid');

const Product = require('../models/products');
// const { MetaSchema } = require('../schema');

router.post('/', (req, res, next) => {
    // Create a product
    const product = new Product({
        productName: req.body.productName,
        price: req.body.price,
        serialNumber: req.body.serialNumber,
        productSKU: req.body.productSKU,
        brand: req.body.brand,
        model: req.body.model,
        category: req.body.category,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        meta: { ...req.body.meta, created: new Date() }
    });
    product.save()
    .then(payload => {
        console.log(payload);
    })
    .catch(err => console.log(err));
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

// const findById = async ({ payload }) => Owner.findOne({ uuid: payload.uuid, 'meta.active': { $gte: true } });

router.get(`/:productUUID`, (req, res, next) => {
    const uuid = req.params.productUUID;
    Product.findOne({ uuid, 'meta.active': { $gte: true } })
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
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
});

module.exports = router;