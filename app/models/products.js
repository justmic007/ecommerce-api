const mongoose = require('mongoose');
const uuid = require('uuid');
const paginate = require('mongoose-paginate');

const { Schema } = mongoose;
const { MetaSchema } = require('../schema');

paginate.paginate.options = {
    limit: 100
};

const productSchema = new Schema({
    uuid: { type: String, default: uuid.v4 },
    productName: { type: String, required: true },
    productImage: { type: [String], required: true },
    price: { type: Number, required: true },
    // serialNumber: { type: String, required: true },
    productSKU: { type: String, required: true },
    noInStock: { type: Number, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    category: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    meta: { type: MetaSchema }
});

productSchema.index({ 'meta.created': -1, 'meta.updated': -1 });

productSchema.plugin(paginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
