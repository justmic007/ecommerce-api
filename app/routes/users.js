const express = require('express');
const router = express.Router();

const User = require('../models/users');

router.post('/signup', (req, res, next) => {
    // Create a user
    const user = new User({
        ...req.body,
        meta: { ...req.body.meta, created: new Date() },
    });
    user
        .save()
        .then(payload => {
            console.log(payload);
            res.status(201).json({
                message: 'Successfully created user',
                createdOrder: {
                    ...payload,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users/' + payload.uuid
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

router.delete('/:orderUUID', (req, res) => {
    const uuid = req.params.orderUUID;
    Order.updateOne(
        { uuid },
        {
            $set: { 'meta.active': false, 'meta.updated': new Date() }
        }
    )
    .exec()
    .then(payload => {
            res.status(200).json({
                product: payload,
                message: 'Order deleted',
                request: {
                    type: 'DELETE',
                    description: 'Soft-deletes a single order by its uuid',
                    url: 'http://localhost:3000/orders/'
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
