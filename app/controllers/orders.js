const Order = require('../models/orders');
const Cart = require('../models/carts');

exports.ordersPOST = (req, res) => {
    // Create an order
    const order = new Order({
        ...req.body,
        meta: { ...req.body.meta, created: new Date() },
    });
    order
        .save()
        .then(payload => {
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
    Cart.updateMany({ uuid: { $exists: true } }, { $set: { 'meta.active': false } })

        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.ordersGetAll = () =>
    Order.aggregate([{
        $lookup: {
            from: 'carts',
            localField: 'cartIds',
            foreignField: 'productId',
            as: 'orderedItems'
        }
    }

    ])

// Order.find({ 'meta.active': { $gte: true } }, { __v: 0, _id: 0 })
//     .exec()
//     .then(payload => {
//         const response = {
//             count: payload.length,
//             orders: payload.map(payload => {
//                 return {
//                     payload,
//                     request: {
//                         type: 'GET',
//                         url: 'http://localhost:3000/orders/' + payload.uuid
//                     }
//                 }
//             }),
//         };
//         console.log(payload);
//         res.status(200).json({
//             response
//         });
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });
// }

exports.ordersGetOne = (req, res) => {
    const uuid = req.params.orderUUID;
    Order.findOne({ uuid, 'meta.active': { $gte: true } }, { __v: 0, _id: 0 })
        .exec()
        .then(payload => {
            console.log("From database", payload);
            if (payload) {
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
}

exports.ordersUpdateOne = (req, res) => {
    const uuid = req.params.orderUUID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Order.updateOne({ uuid: uuid }, { $set: updateOps, 'meta.updated': Date.now() })
        .exec()
        .then(payload => {
            res.status(200).json({
                product: payload,
                message: 'Order updated',
                request: {
                    type: 'PUT',
                    description: 'Updates a Single order',
                    url: 'http://localhost:3000/orders/' + uuid
                }
            })
        })
        .catch(err => {
            res.status({
                error: err
            })
        })
}

exports.ordersDeleteOne = (req, res) => {
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
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}


