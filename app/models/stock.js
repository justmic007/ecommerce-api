const mongoose = require('mongoose');
const uuid = require('uuid');
const paginate = require('mongoose-paginate');

const { Schema } = mongoose;
const { MetaSchema } = require('../schema');

paginate.paginate.options = {
  limit: 100
};

const stockSchema = new Schema({
  uuid: { type: String, default: uuid.v4 },
  productName: { type: String, required: true },
  batchNo: { type: String, required: true },
  noInStock: { type: Number, required: true },
  productSKU: { type: String, required: true },
  brand: { type: String, required: true },
  manufacturer: { type: String, required: true },
  meta: { type: MetaSchema }
});

stockSchema.index({ 'meta.created': -1, 'meta.updated': -1 });

stockSchema.plugin(paginate);

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
