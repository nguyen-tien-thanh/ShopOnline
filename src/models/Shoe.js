
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Shoe = new Schema({
    brand: {type: mongoose.Schema.Types.ObjectId, ref:'Brand'},
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'Shoetype'},

    name: {type: String, minLength: 1, maxLength: 255},
    color: {type: String},
    price: {type: Number, minLength:1, default: 0},
    // size: {type: Number, minLength:1, maxlength:2, default: 2},
    size: [{
        number: {type: Number, minLength:1, maxLength:2 },
        stock: {type: Number}
    }],
    image: {type : String, minLength : 1},
    rate: {type: Number, minLength:1, default:0},
    quantity: {type: Number, minLength:1, default:0},
    available: {type: Boolean, default: true},
    bestseller: {type: Boolean, default: false},
    sale: {type: Number, default: 0},
    slug: {type : String, slug : 'name', unique: true},
    deletedAt: {},
    // createdAt: {type: Date, default : Date.Now},
    // updateAt: {type: Date, default : Date.Now}
}, {
    timestamps : true,
});

//Add plugin
Shoe.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});
mongoose.plugin(slug);

module.exports = mongoose.model('Shoe', Shoe);