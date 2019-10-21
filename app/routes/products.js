const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // accept or reject a file
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    } else {
        cb(new Error('Check your file type. Only PNG/JPEG file format is accepted'), false);
    }
};

const upload = multer({
    // dest: 'uploads/'
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


const Product = require('../models/products');

router.post('/', upload.single('productImage'), (req, res) => {
    // console.log('@@FILE', req.file)
    // Create a product
    const product = new Product({
        productName: req.body.productName,
        productImage: req.file.path,
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
                    productImage: req.file.path,
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
});

router.get('/', (req, res) => {
    Product.find({'meta.active': { $gte: true }}, {__v: 0, _id: 0})
    .exec()
    .then(payload => {
        const response = {
            count: payload.length,
            products: payload.map(payload => {
                return {
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
                }}),
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
});

router.get(`/:productUUID`, (req, res) => {
    const uuid = req.params.productUUID;
    Product.findOne({ uuid, 'meta.active': { $gte: true } }, {__v: 0, _id: 0})
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
            }});
        } else {
            res.status(404).json({ message: 'Not found'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.put('/:productUUID', (req, res) => {
    const uuid = req.params.productUUID;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ uuid: uuid }, { $set: updateOps, 'meta.updated': Date.now()})
        .exec()
        .then(payload => {
            res.status(200).json({
                product: payload,
                message: 'Product updated',
                request: {
                    type: 'PUT',
                    description: 'Updates a Single product',
                    url: 'http://localhost:3000/products/' + uuid
        }})
    })
    .catch(err => {
        res.status({
            error: err
        })
    })
});

router.delete('/:productUUID', (req, res) => {
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