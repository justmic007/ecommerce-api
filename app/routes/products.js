const express = require('express');
const router = express.Router();

const Product = require('../models/products');

router.post('/', (req, res) => {
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
    product
        .save()
        .then(payload => {
            console.log(payload);
            res.status(201).json({
                message: 'Handling POST requests to /products',
                createdProduct: payload
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/', (req, res) => {
    Product.find({'meta.active': { $gte: true }})
    .exec()
    .then(payload => {
        console.log(payload)
        if (payload) {
            res.status(200).json({
                payload
        })
        } else {
            res.status(404).json({
                message: 'Not found'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get(`/:productUUID`, (req, res) => {
    const uuid = req.params.productUUID;
    Product.findOne({ uuid, 'meta.active': { $gte: true } })
    .exec()
    .then(payload => {
        console.log(payload);
        if (payload) {
            res.status(200).json(payload);
        } else {
            res.status(404).json({ message: 'Not found'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.put('/:productUUID', (req, res) => {
    const uuid = req.params.productUUID;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ uuid: uuid }, { $set: updateOps, 'meta.updated': Date.now()})
        .exec()
    .then(payload => {
        res.status(200).json({
            payload
        })
    })
    .catch(err => {
        res.status({
            error: err
        })
    })
});

router.delete('/:productUUID', (req, res) => {
    const uuid = req.params.productUUID;
    Product.updateOne(
        { uuid },
        {
            $set: { 'meta.active': false, 'meta.updated': new Date() }
        }
    )
    .exec()
    .then(payload => {
        res.status(200).json({
            payload
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;