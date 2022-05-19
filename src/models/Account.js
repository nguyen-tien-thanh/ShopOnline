
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const User = require('./User')

const Schema = mongoose.Schema;

const Account = new Schema({
    username: {type:String},
    account_email: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    deletedAt: {},
    // createdAt: {type: Date, default : Date.Now},
    // updateAt: {type: Date, default : Date.Now}
}, {
    timestamps : true,
});

//Add plugin
Account.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});
mongoose.plugin(slug);

module.exports = mongoose.model('Account', Account);