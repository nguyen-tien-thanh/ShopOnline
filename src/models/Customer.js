
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Customer = new Schema({
    name: {type: String, minLength: 1, maxLength: 255},
    phone: {type: Number, maxLength: 11},
    email: {type: String, minLength: 1, maxLength: 255},
    birthday: {type: Date, default: 0},
    address: {type: String, minLength: 1, maxLength: 255},
    gender: {type: Boolean, minLength: 1, maxLength: 255},
    avatar: {type: String, maxLength: 255},
    deletedAt: {},
    // createdAt: {type: Date, default : Date.Now},
    // updateAt: {type: Date, default : Date.Now}
}, {
    timestamps : true,
});

//Add plugin
Customer.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});
mongoose.plugin(slug);

module.exports = mongoose.model('Customer', Customer);