const Stock = require('../models/stock');

exports.stockPOST = (req, res) => {
  // Create a stock
  const stock = new Stock({
    productName: req.body.productName,
    batchNo: req.body.batchNo,
    noInStock: req.body.noInStock,
    productSKU: req.body.productSKU,
    brand: req.body.brand,
    manufacturer: req.body.manufacturer,
    meta: { ...req.body.meta, created: new Date() }
  });

  stock
    .save()
    .then(payload => {
      res.status(201).json({
        message: 'Created stock successfully',
        createdStock: {
          productName: payload.productName,
          productSKU: payload.productSKU,
          brand: payload.brand,
          category: payload.category,
          manufacturer: payload.manufacturer,
          uuid: payload.uuid,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/stock/' + payload.uuid
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

exports.stockGetAll = (req, res) => {
  Stock.find({ 'meta.active': { $gte: true } }, { __v: 0, _id: 0 })
    .exec()
    .then(payload => {
      const response = {
        count: payload.length,
        stocks: payload.map(payload => {
          return {
            productName: payload.productName,
            productSKU: payload.productSKU,
            brand: payload.brand,
            manufacturer: payload.manufacturer,
            description: payload.description,
            uuid: payload.uuid,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/stock/' + payload.uuid
            }
          }
        }),
      };
      console.log(payload)
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

exports.stockGetOne = (req, res) => {
  const uuid = req.params.stockUUID;
  Stock.findOne({ uuid, 'meta.active': { $gte: true } }, { __v: 0, _id: 0 })
    .exec()
    .then(payload => {
      console.log("From database", payload);
      if (payload) {
        res.status(200).json({
          stock: payload,
          request: {
            type: 'GET',
            description: 'Get a Single stock',
            url: 'http://localhost:3000/stock/' + payload.uuid
          }
        });
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}

exports.stockUpdateOne = (req, res) => {
  const uuid = req.params.stockUUID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Stock.updateOne({ uuid: uuid }, { $set: updateOps, 'meta.updated': Date.now() })
    .exec()
    .then(payload => {
      res.status(200).json({
        stock: payload,
        message: 'Stock updated',
        request: {
          type: 'PUT',
          description: 'Updates a Single stock',
          url: 'http://localhost:3000/stock/' + uuid
        }
      })
    })
    .catch(err => {
      res.status({
        error: err
      })
    })
}

exports.stockDeleteOne = (req, res) => {
  const uuid = req.params.stockUUID;
  Stock.updateOne(
    { uuid },
    {
      $set: { 'meta.active': false, 'meta.updated': new Date() }
    }
  )
    .exec()
    .then(payload => {
      res.status(200).json({
        stock: payload,
        message: 'Stock deleted',
        request: {
          type: 'DELETE',
          description: 'Soft-deletes a single stock by its uuid',
          url: 'http://localhost:3000/stock/'
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
