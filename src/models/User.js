
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const findOrCreate = require('mongoose-findorcreate')
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    name: {type: String, minLength: 1, maxLength: 255},
    phone: {type: String, maxLength: 11},
    email: {type: String, minLength: 1, maxLength: 255},
    password: {type: String},
    money: {type: Number, default: 0},
    birthday: {type: Date, default: 0},
    role: {type: String, default: 'Customer'},
    address: {type: String, minLength: 1, maxLength: 255},
    gender: {type: String, default: 'male'},
    avatar: {type: String, maxLength: 255, default: 'sample-avatar.jpg'},
    
    googleId: { type: String,},
    facebookId: {type: String},

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
mongoose.plugin(findOrCreate);
mongoose.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);