
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const History = new Schema({
    name: {type: String, minLength: 1, maxLength: 255},
    desc: {type: String},
    type: {type: String, minLength: 1, maxLength: 255},
    amount: {type: String, minLength: 1, maxLength: 255},
    status: {type: String, minLength: 1, maxLength: 255},
    
    deletedAt: {},
    // createdAt: {type: Date, default : Date.Now},
    // updateAt: {type: Date, default : Date.Now}
}, {
    timestamps : true,
});

//Add plugin
History.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});
mongoose.plugin(slug);

module.exports = mongoose.model('History', History);