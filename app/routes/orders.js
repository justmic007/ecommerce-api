const express = require('express');
const router = express.Router();

const Order = require('../models/orders');

router.post('/', (req, res, next) => {
    // Create an order
    const order = new Order({
        // productList: req.body.productList,
        // totalAmount: req.body.totalAmount,
        // paymentMethod: req.body.paymentMethod,
        // deliveryMethod: req.body.deliveryMethod,
        // orderNumber: req.body.orderNumber,
        // billingAddress: req.body.billingAddress,
        // orderStatus: req.body.orderStatus,
        // totalNumberOfItems: req.body.totalNumberOfItems,
        // shippingAddress: req.body.shippingAddress,
        // receiverName: req.body.receiverName,
        // receiverPhoneNumber: req.body.receiverPhoneNumber,
        // phoneNumber: req.body.phoneNumber
        ...req.body
    });
    order
        .save()
        .then(payload => {
            console.log(payload);
            res.status(201).json({
                message: 'Successfully ordered item(s)',
                createdOrder: {
                    ...payload,
                    // uuid: payload.uuid,
                    // productList: payload.productList,
                    // totalAmount: payload.totalAmount,
                    // paymentMethod: payload.paymentMethod,
                    // deliveryMethod: payload.deliveryMethod,
                    // orderNumber: payload.orderNumber,
                    // billingAddress: payload.billingAddress,
                    // orderStatus: payload.orderStatus,
                    // totalNumberOfItems: payload.totalNumberOfItems,
                    // shippingAddress: payload.shippingAddress,
                    // receiverName: payload.receiverName,
                    // receiverPhoneNumber: payload.receiverPhoneNumber,
                    // phoneNumber: payload.phoneNumber,
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
                    // ...payload,
                    // uuid: payload.uuid,
                    productList: req.body.productList,
                    totalAmount: req.body.totalAmount,
                    paymentMethod: req.body.paymentMethod,
                    deliveryMethod: req.body.deliveryMethod,
                    orderNumber: req.body.orderNumber,
                    billingAddress: req.body.billingAddress,
                    orderStatus: req.body.orderStatus,
                    totalNumberOfItems: req.body.totalNumberOfItems,
                    shippingAddress: req.body.shippingAddress,
                    receiverName: req.body.receiverName,
                    receiverPhoneNumber: req.body.receiverPhoneNumber,
                    phoneNumber: req.body.phoneNumber,
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

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});


module.exports = router;
