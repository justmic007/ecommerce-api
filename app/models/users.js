const mongoose = require('mongoose');
const uuid = require('uuid');
const paginate = require('mongoose-paginate');

const { Schema } = mongoose;
const { MetaSchema } = require('../schema');

paginate.paginate.options = {
  limit: 100
};

const AddressSchema = new Schema({
  addressLine1: { type: String },
  addressLine2: { type: String, required: false },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
});

const PersonSchema = new Schema({
  firstname: { type: String },
  lastname: { type: String },
  middlename: { type: String },
  companyName: { type: String },
  gender: { type: String, enum: ['m', 'f'] },
  dob: { type: Date },
  telephone: { type: String },
  customer: { type: String, enum: ['SELLER', 'BUYER'] },
  addresses: { type: [AddressSchema] },
});

const userSchema = new Schema({
  uuid: { type: String, default: uuid.v4 },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: { type: String, required: true },
  person: PersonSchema,
  meta: { type: MetaSchema }
});

userSchema.index({ 'meta.created': -1, 'meta.updated': -1 });

userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);

module.exports = User;
