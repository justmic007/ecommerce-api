const Cart = require('../models/carts');

exports.cartsPOST = (req, res) => {
  // Create a cart
  const cart = new Cart({
    product: req.body.product,
    quantity: req.body.quantity,
    // totalAmount: req.body.totalAmount,
    meta: { ...req.body.meta, created: new Date() }
  });

  cart.save()
    .then(payload => {
      res.status(201).json({
        message: 'Added product cart successfully',
        createdCart: {
          product: payload.product,
          quantity: payload.quantity,
          // totalAmount: req.body.totalAmount,
          uuid: payload.uuid,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/carts/' + payload.uuid
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
}

// db.orders.aggregate([
//     { $match: { status: "A" } },
//     { $group: { _id: "$cust_id", total: { $sum: "$amount" } } }
//  ])

exports.cartsGetAll = (req, res) => {
  Cart.find({ 'meta.active': { $gte: true } }, { __v: 0, _id: 0 })
    .populate('productId')
    .exec()
    .then(payload => {
      const response = {
        count: payload.length,
        products: payload.map(payload => {
          return {
            productId: payload.productId,
            quantity: payload.quantity,
            uuid: payload.uuid,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/carts/' + payload.uuid
            }
          }
        }),
      };

      res.status(200).json({
        response
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.cartsGetOne = (req, res) => {
  const uuid = req.params.productUUID;
  // Cart.findOne({ uuid, 'meta.active': { $gte: true } }, { __v: 0, _id: 0 })
  //     .exec()
  //     .then(payload => {
  //         console.log("From database", payload);
  //         if (payload) {
  //             res.status(200).json({
  //                 product: payload,
  //                 request: {
  //                     type: 'GET',
  //                     description: 'Get a Single product(item) from Cart',
  //                     url: 'http://localhost:3000/carts/' + payload.uuid
  //                 }
  //             });
  //         } else {
  //             res.status(404).json({ message: 'Not found' });
  //         }
  //     })
  //     .catch(err => {
  //         console.log(err);
  //         res.status(500).json({ error: err });
  //     });
}

exports.cartsUpdateOne = (req, res) => {
  const uuid = req.params.productUUID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Cart.updateOne({ uuid: uuid }, { $set: updateOps, 'meta.updated': Date.now() })
    .exec()
    .then(payload => {
      res.status(200).json({
        cart: payload,
        message: 'Product in cart updated',
        request: {
          type: 'PUT',
          description: 'Updates a Single product in cart',
          url: 'http://localhost:3000/carts/' + uuid
        }
      })
    })
    .catch(err => {
      res.status({
        error: err
      })
    })
}

exports.cartsDeleteOne = (req, res) => {
  const uuid = req.params.productUUID;
  Cart.deleteOne(
    { uuid },
    {
      $set: { 'meta.updated': new Date() }
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