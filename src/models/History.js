
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

const History = new Schema({
    // name: {type: String, minLength: 1, maxLength: 255},
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    amount: {type: Number, min: 0},
    desc: {type: String},
    type: {type: String, minLength: 1, maxLength: 255},
    status: {type: String, minLength: 1, maxLength: 255},
    slug: {type : String, slug : 'desc', unique: true},
    
    // createdAt: {type: Date, default : Date.Now},
    // updateAt: {type: Date, default : Date.Now}
}, {
    timestamps : true,
});

mongoose.plugin(slug);

module.exports = mongoose.model('History', History);