
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Custom = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    swooth: {type: String},
    midsole: {type: String},
    middle: {type: String},
    head: {type: String},
    back: {type: String},
    backward: {type: String},
    price: {type: Number, default: 2100000},
    name: {type: String, default: 'Air Force 1 Custom'},
    image: {type : String, default: 'shoetype1.png'},
    slug: {type: String, slug:'user', unique: true}
    // createdAt: {type: Date, default : Date.Now},
    // updateAt: {type: Date, default : Date.Now}
}, {
    timestamps : true,
});

//Add plugin
Custom.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});
mongoose.plugin(slug);

module.exports = mongoose.model('Custom', Custom);