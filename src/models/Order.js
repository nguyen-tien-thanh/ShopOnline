
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Order = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true },
    email: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: Number, required: true},
    name: {type: String, minLength: 1, maxLength: 255},
    shipping: {type: String, required: true},
    deletedAt: {},
    // createdAt: {type: Date, default : Date.Now},
    // updateAt: {type: Date, default : Date.Now}
}, {
    timestamps : true,
});

//Add plugin
Order.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});
mongoose.plugin(slug);

module.exports = mongoose.model('Order', Order);