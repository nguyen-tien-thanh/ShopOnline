
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

const Notification = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    desc: {type: String},
    isRead: {type: Boolean, default: false},
    slug: {type : String, slug : '_id', unique: true},
}, {
    timestamps : true,
});
mongoose.plugin(slug);

module.exports = mongoose.model('Notification', Notification);