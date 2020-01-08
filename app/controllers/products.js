const Product = require('../models/products');

exports.productsPOST = (req, res) => {
    console.log('@@FILE', ...req.files.map(path => {
        path
    }));
    console.log('@@FILE', req.body);
    // Create a product
    const product = new Product({
        stockItem: req.body.stockItem,
        productImage: req.files.map(({ path }) => path),
        unitPrice: req.body.unitPrice,
        model: req.body.model,
        category: req.body.category,
        description: req.body.description,
        meta: { ...req.body.meta, created: new Date() }
    });
    product
        .save()
        .then(payload => {
            console.log({ payload });
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    stockItem: payload.stockItem,
                    productImage: payload.productImage,
                    unitPrice: payload.unitPrice,
                    productSKU: payload.productSKU,
                    model: payload.model,
                    category: payload.category,
                    description: payload.description,
                    uuid: payload.uuid,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + payload.uuid
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

exports.productsGetAll = (req, res) => {
    Product.find({ 'meta.active': { $gte: true } }, { __v: 0, _id: 0 })
        .exec()
        .then(payload => {
            const response = {
                count: payload.length,
                products: payload.map(payload => {
                    return {
                        stockItem: payload.stockItem,
                        productImage: payload.productImage,
                        unitPrice: payload.unitPrice,
                        productSKU: payload.productSKU,
                        model: payload.model,
                        category: payload.category,
                        description: payload.description,
                        uuid: payload.uuid,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + payload.uuid
                        }
                    }
                }),
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
}

exports.productsGetOne = (req, res) => {
    const uuid = req.params.productUUID;
    Product.findOne({ uuid, 'meta.active': { $gte: true } }, { __v: 0, _id: 0 })
        .exec()
        .then(payload => {
            console.log("From database", payload);
            if (payload) {
                res.status(200).json({
                    product: payload,
                    request: {
                        type: 'GET',
                        description: 'Get a Single product',
                        url: 'http://localhost:3000/products/' + payload.uuid
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

exports.productsUpdateOne = (req, res) => {
    const uuid = req.params.productUUID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ uuid: uuid }, { $set: updateOps, 'meta.updated': Date.now() })
        .exec()
        .then(payload => {
            res.status(200).json({
                product: payload,
                message: 'Product updated',
                request: {
                    type: 'PUT',
                    description: 'Updates a Single product',
                    url: 'http://localhost:3000/products/' + uuid
                }
            })
        })
        .catch(err => {
            res.status({
                error: err
            })
        })
}

exports.productsDeleteOne = (req, res) => {
    const uuid = req.params.productUUID;
    Product.updateOne(
        { uuid },
        {
            $set: { 'meta.active': false, 'meta.updated': new Date() }
        }
    )
        .exec()
        .then(payload => {
            res.status(200).json({
                product: payload,
                message: 'Product deleted',
                request: {
                    type: 'DELETE',
                    description: 'Soft-deletes a single product by its uuid',
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
