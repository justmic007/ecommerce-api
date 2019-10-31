const Order = require('../models/orders');

exports.ordersPOST = (req, res) => {
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
                    payload,
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
}