const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware-auth/check-auth');
// const Product = require('../models/products');

const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // accept or reject a file
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('Check your file type. Only PNG/JPEG file format is accepted'), false);
  }
};

const upload = multer({
  // dest: 'uploads/'
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20
  },
  fileFilter: fileFilter
});


router.post('/', checkAuth, upload.array('productImage', 5), ProductController.productsPOST);

router.get('/', ProductController.productsGetAll);

router.get(`/:productUUID`, ProductController.productsGetOne);

router.put('/:productUUID', checkAuth, ProductController.productsUpdateOne);

router.delete('/:productUUID', checkAuth, ProductController.productsDeleteOne);

module.exports = router;