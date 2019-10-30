const mongoose = require('mongoose');
const uuid = require('uuid');
const paginate = require('mongoose-paginate');

const { Schema } = mongoose;
const { MetaSchema, CART } = require('../schema');

paginate.paginate.options = {
    limit: 100
};

const orderSchema = new Schema({
    uuid: { type: String, default: uuid.v4 },
    productList: { type: String, ref: CART, required: true },
    // quantity: { type: Number, default: 1 },
    // totalAmount: { type: Number, default: 0.00, required: true },
    paymentMethod: { type: String, enum: ['PAY ON DELIVERY', 'CREDIT CARD'], required: true },
    deliveryMethod: { type: String, enum: ['HOME DELIVERY', 'PICK UP'], required: true },
    orderNumber: { type: Number, required: true },
    billingAddress: { type: String, required: true },
    // customer: { type: Number, default: 1 },
    orderStatus: { type: String, enum: ['PENDING', 'DELIVERED'], required: true },
    totalNumberOfItems: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    receiverName: { type: String, required: true },
    receiverPhoneNumber: { type: Number, required: true },
    phoneNumber: { type: Number, required: true },
    meta: { type: MetaSchema }
});

orderSchema.index({ 'meta.created': -1, 'meta.updated': -1 });

orderSchema.plugin(paginate);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
