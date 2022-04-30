
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Product = new Schema({
    name: {type: String, minLength: 1, maxLength: 255},
    description: {type: String, maxLength: 600},
    buff: {type: Number, minLength:1, maxLength: 4, default:0},
    stock: {type: Number, minLength:1, default:0},
    price: {type: Number, minLength:1, default: 0},
    image: {type : String, minLength : 1},
    avaiable: {type: Boolean, default: true},
    slug: {type : String, slug : 'name', unique: true},
    deletedAt: {},
    // createdAt: {type: Date, default : Date.Now},
    // updateAt: {type: Date, default : Date.Now}
}, {
    timestamps : true,
});

//Add plugin
Product.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});
mongoose.plugin(slug);

module.exports = mongoose.model('Product', Product);