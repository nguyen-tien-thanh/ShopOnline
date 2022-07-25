
const Noti = require('../models/Notification')
// const {mongooseToObject, multipleMongooseToObject} = require('../ulti/mongoose')

class NotificationController {

    //[GET] /noti/:id
    read(req,res,next){
        Noti.findByIdAndUpdate(req.params.id, {$set: {isRead: true}})
        .then(() => {
            res.send({message: 'Read'})
        })
        .catch(() => res.send({message: 'Error'}))
    }
}

module.exports = new NotificationController;

const res = require('express/lib/response');
const notiController = require('./NotificationController');