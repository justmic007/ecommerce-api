const Product = require('../models/products');

exports.productsPOST = (req, res) => {
    console.log('@@FILE', ...req.files.map(path => {
        path
    }));
    console.log('@@FILE', req.body);
    // Create a product
    const product = new Product({
        productName: req.body.productName,
        productImage: req.files.map(({ path }) => path),
        price: req.body.price,
        serialNumber: req.body.serialNumber,
        productSKU: req.body.productSKU,
        brand: req.body.brand,
        model: req.body.model,
        category: req.body.category,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        meta: { ...req.body.meta, created: new Date() }
    });
    product
        .save()
        .then(payload => {
            console.log({payload});
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    productName: payload.productName,
                    productImage: payload.productImage,
                    price: payload.price,
                    serialNumber: payload.serialNumber,
                    productSKU: payload.productSKU,
                    brand: payload.brand,
                    model: payload.model,
                    category: payload.category,
                    manufacturer: payload.manufacturer,
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