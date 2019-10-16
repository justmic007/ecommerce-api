const express = require('express');
const router = express.Router();

const Order = require('../models/orders');

router.post('/', (req, res) => {
    // Create an order
    const order = new Order({
        ...req.body,
        meta: { ...req.body.meta, created: new Date() },
    });
    order
        .save()
        .then(payload => {
            console.log(payload);
            res.status(201).json({
                message: 'Successfully ordered item(s)',
                createdOrder: {
                    ...payload,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + payload.uuid
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
    Order.find({'meta.active': { $gte: true }}, {__v: 0, _id: 0})
    .exec()
    .then(payload => {
        const response = {
            count: payload.length,
            orders: payload.map(payload => {
                return {
                    ...req.body,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + payload.uuid
                    }
                }
            }),
        };
        console.log(payload);
        res.status(200).json({
            response
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:orderUUID', (req, res) => {
    const uuid = req.params.orderUUID;
    Order.findOne({ uuid, 'meta.active': { $gte: true }}, {__v: 0, _id: 0})
    .exec()
    .then(payload => {
        console.log("From database", payload);
        if(payload) {
            res.status(200).json({
                order: payload,
                request: {
                    type: 'GET',
                    description: 'Fetch an order',
                    url: 'http://localhost:3000/orders/' + payload.uuid
                }
            });
        } else {
            res.status(404).json({
                message: 'Not found'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.put('/:orderUUID', (req, res) => {
    const uuid = req.params.orderUUID;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Order.updateOne({ uuid: uuid }, { $set: updateOps, 'meta.updated': Date.now()})
        .exec()
        .then(payload => {
            res.status(200).json({
                product: payload,
                message: 'Order updated',
                request: {
                    type: 'PUT',
                    description: 'Updates a Single order',
                    url: 'http://localhost:3000/orders/' + uuid
        }})
    })
    .catch(err => {
        res.status({
            error: err
        })
    })
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});


module.exports = router;
