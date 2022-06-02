
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');


const Shoetype = new Schema({
    name: {type: String, minLength: 1, maxLength: 255},
    image: {type: String},
    deletedAt: {},
}, {
    timestamps : true,
});

//Add plugin
Shoetype.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});


module.exports = mongoose.model('Shoetype', Shoetype);