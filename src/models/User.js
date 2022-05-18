
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const User = new Schema({
    name: {type: String, minLength: 1, maxLength: 255},
    phone: {type: String, maxLength: 11},
    email: {type: String, minLength: 1, maxLength: 255},
    password: {type: String},
    birthday: {type: Date, default: 0},
    role: {type: String, default: 'Customer'},
    address: {type: String, minLength: 1, maxLength: 255},
    gender: {type: Boolean, minLength: 1, maxLength: 255},
    avatar: {type: String, maxLength: 255},
    permission: { type: Boolean, default: false},
    countlogin: { type: Number, default:0 },
    countFailed: { type: Number, default:0 },
    deletedAt: {},
    // createdAt: {type: Date, default : Date.Now},
    // updateAt: {type: Date, default : Date.Now}
}, {
    timestamps : true,
});

//Add plugin
User.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});
mongoose.plugin(slug);

module.exports = mongoose.model('User', User);