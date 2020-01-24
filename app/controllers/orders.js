const Order = require('../models/orders');
const Cart = require('../models/carts');
// const Product = require('../models/products');
const Stock = require('../models/stock');

exports.ordersPOST = (req, res) => {
  // Create an order
  let totalAmount = 0;
  let numberOfItems = 0;
  Cart.find({ 'meta.active': true }).then(
    cartItems => {
      cartItems.forEach((cart) => (totalAmount += cart.itemAmount,
        numberOfItems += cart.quantity)
      )

      const order = new Order({
        ...req.body,
        totalAmount: totalAmount,
        totalNumberOfItems: numberOfItems,
        meta: { ...req.body.meta, created: new Date() },
      });
      order
        .save()
        .then(payload => {
          const { cartIds } = payload;

          for (const id in cartIds) {

            Cart.findOne({ uuid: cartIds[id] })
              .then(x => {
                let stockUUID = x.product.stockId;
                let cartQTY = x.quantity
                let uuid = x.uuid
                Stock.updateOne({ uuid: stockUUID }, { $inc: { noInStock: -cartQTY } }).then(
                  Cart.updateOne({ uuid: uuid }, { $set: { 'meta.active': false } }).then(
                    u => console.log(u)
                  )
                )
              },
              )
              .catch(err => console.log(err));
          }

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
  )

  // const { body: { cartIds } } = req;
  // console.log(cartIds);
  // Cart.find({ 'meta.active': false })
  //   .then(carts => carts
  //     .map(cart => console.log(Product.find({})
  //     cart.productId)));


  // (async () => {
  //   const carts = await Cart.find({ uuid: { $in: cartIds } });
  //   // console.log(carts.reduce((accum, { productId, quantity })));

  //   const productIds = carts.reduce((accum, { product, quantity }) => [...accum, { product, quantity }], []);

  //   console.log(productIds);

  //   const stocks = await Promise.all(productIds.map(async ({ product: uuid, quantity }) => ({ stock: await Product.find({ uuid }).select('stockItem').lean(), quantity })));


  //   console.log(JSON.stringify(stocks))
  // carts.forEach(async cart => await cart.update({ $set: { 'meta.active': false } }));
  // carts.forEach(async cart => console.log(cart.productId));
  // console.log(...products);
  // })();

  // console.log(Product.find());


  // Cart.updateMany({ uuid: { $in: cartIds } }, { $set: { 'meta.active': false } })
  //   .then(
  //     Cart.forEach(cart => console.log(cart))
  //   );

  // carts.forEach(cart => console.log(cart))
  // Cart.find({ uuid: { $in: cartIds } })
  //   .then(carts => {
  //     console.log(Product.aggregate([{
  //       $lookup: {
  //         from: 'carts',
  //         localField: 'uuid',
  //         foreignField: 'productId'
  //       }
  //       console.log(localField);

  //     }]));
  //     // carts.forEach(cart => console.log(cart))
  //   });
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


