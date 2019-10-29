const mongoose = require('mongoose');
const uuid = require('uuid');
const paginate = require('mongoose-paginate');

const { Schema } = mongoose;
const { MetaSchema, PRODUCT } = require('../schema');

paginate.paginate.options = {
    limit: 100
};

const cartSchema = new Schema({
    uuid: { type: String, default: uuid.v4 },
    productName: { type: String, ref: PRODUCT, required: true },
    quantity: { type: Number, default: 1 },
    totalAmount: { type: Number, default: 0.00 },
    meta: { type: MetaSchema }
});

cartSchema.index({ 'meta.created': -1, 'meta.updated': -1 });

cartSchema.plugin(paginate);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
