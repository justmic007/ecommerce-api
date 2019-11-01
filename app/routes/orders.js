const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware-auth/check-auth');
const Order = require('../models/orders');
const OrdersController = require('../controllers/orders');

router.post('/', checkAuth, OrdersController.ordersPOST );

router.get('/', checkAuth, OrdersController.ordersGetAll );

router.get('/:orderUUID', checkAuth, (req, res) => {
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

router.put('/:orderUUID', checkAuth, (req, res) => {
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

router.delete('/:orderUUID', checkAuth, (req, res) => {
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
