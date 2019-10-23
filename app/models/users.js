const mongoose = require('mongoose');
const uuid = require('uuid');
const paginate = require('mongoose-paginate');

const { Schema } = mongoose;
const { MetaSchema } = require('../schema');

paginate.paginate.options = {
    limit: 100
};

const userSchema = new Schema({
    uuid: { type: String, default: uuid.v4 },
    email: { type: String, required: true },
    password: { type: String, required: true },
    meta: { type: MetaSchema }
});

userSchema.index({ 'meta.created': -1, 'meta.updated': -1 });

userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);

module.exports = User;
