const express = require('express');
const router = express.Router();

const Cart = require('../models/carts');

router.post('/', (req, res) => {
    // Create a cart
    const cart = new Cart({
        productName: req.body.productName,
        quantity: req.body.quantity,
        meta: { ...req.body.meta, created: new Date() }
    });
    cart
        .save()
        .then(payload => {
            console.log(payload);
            res.status(201).json({
                message: 'Added product cart successfully',
                createdCart: {
                    productName: payload.productName,
                    quantity: payload.quantity,
                    uuid: payload.uuid,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/carts/' + payload.uuid
                    }
                }
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
    Cart.find({'meta.active': { $gte: true }}, {__v: 0, _id: 0})
    .exec()
    .then(payload => {
        const response = {
            count: payload.length,
            products: payload.map(payload => {
                return {
                    productName: req.body.productName,
                    quantity: req.body.quantity,
                    uuid: payload.uuid,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/carts/' + payload.uuid
                    }
                }}),
        };
        console.log(payload)
        // if (payload) {
            res.status(200).json({
                response
        })
        // } else {
        //     res.status(404).json({
        //         message: 'Not found'
        //     })
        // }
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
    Cart.findOne({ uuid, 'meta.active': { $gte: true } }, {__v: 0, _id: 0})
    .exec()
    .then(payload => {
        console.log("From database", payload);
        if (payload) {
            res.status(200).json({
                product: payload,
                request: {
                    type: 'GET',
                    description: 'Get a Single product(item) from Cart',
                    url: 'http://localhost:3000/carts/' + payload.uuid
            }});
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
    Cart.updateOne({ uuid: uuid }, { $set: updateOps, 'meta.updated': Date.now()})
        .exec()
        .then(payload => {
            res.status(200).json({
                cart: payload,
                message: 'Product in cart updated',
                request: {
                    type: 'PUT',
                    description: 'Updates a Single product in cart',
                    url: 'http://localhost:3000/carts/' + uuid
        }})
    })
    .catch(err => {
        res.status({
            error: err
        })
    })
});

router.delete('/:productUUID', (req, res) => {
    const uuid = req.params.productUUID;
    Cart.deleteOne(
        { uuid },
        {
            $set: {'meta.updated': new Date() }
        }
    )
    .exec()
    .then(payload => {
            res.status(200).json({
                product: payload,
                message: 'Product deleted',
                request: {
                    type: 'DELETE',
                    description: 'Deletes a single product by its uuid',
                    url: 'http://localhost:3000/products/'
        }})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;