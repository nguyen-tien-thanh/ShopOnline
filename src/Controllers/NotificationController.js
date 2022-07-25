
const Noti = require('../models/Notification')
// const {mongooseToObject, multipleMongooseToObject} = require('../ulti/mongoose')

class NotificationController {

    //[GET] /noti/:id
    read(req,res,next){
        Noti.findByIdAndUpdate(req.body.notiId, {$set: {isRead: true}})
        .then(() => {
            console.log('Send')
            res.send({msg: 'Success read'})
        })
        .catch(() => res.send({msg: 'Error'}))
    }
}

module.exports = new NotificationController;

const res = require('express/lib/response');
const notiController = require('./NotificationController');