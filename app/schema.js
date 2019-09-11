const mongoose = require('mongoose');
const { Schema } = mongoose;

const MetaSchema = new Schema({
  active: { type: Boolean, default: true },
  updated: { type: Date },
  created: { type: Date },
}, { _id: false });

module.exports = {
  MetaSchema
};