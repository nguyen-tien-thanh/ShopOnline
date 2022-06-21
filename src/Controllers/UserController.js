

const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Brand = require('../models/Brand')
const Shoetype = require('../models/Shoetype')
const Shoe = require('../models/Shoe')
const Product = require('../models/Product')
const {mongooseToObject, multipleMongooseToObject} = require('../ulti/mongoose')



var secret = 'secretpasstoken'
class UserController {

    // [PUT] /user/:id 
    update(req, res, next) {
        User.updateOne({_id: req.params.id}, req.body)
            .then(() => {
                req.flash('successMsg', 'Your profile has been updated'),
                res.redirect('/user/profile')
            })
            .catch(next);
    }

    // [GET] /user/profile/
    profile(req,res,next){
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        User.findOne({ _id: decodeToken})
        .then(data => {
            if (data) {
                req.data = data
                return res.render('user/profile',
                    {
                        user: mongooseToObject(data),
                        title: 'user',
                        message: req.flash('successMsg')
                    })
                next()
            }
        })
    }

    // [GET] /user/changeps/
    changeps(req,res,next){
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        User.findOne({ _id: decodeToken})
        .then(data => {
            if (data) {
                req.data = data
                return res.render('user/changeps',
                    {
                        user: mongooseToObject(data),
                        title: 'Transfer',
                        message: req.flash('successMsg')
                    })
                next()
            }
        })
    }

    // [GET] /user/transfer/
    transfer(req,res,next){
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        User.findOne({ _id: decodeToken})
        .then(data => {
            if (data) {
                req.data = data
                return res.render('user/transfer',
                    {
                        user: mongooseToObject(data),
                        title: 'Transfer',
                        message: req.flash('successMsg')
                    })
                next()
            }
        })
    }

    // [GET] /index -- Home page
    index(req, res, next){

        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        User.findOne({ _id: decodeToken})
        .then(data => {
            if (data) {
                req.data = data
                return res.render('index',
                    {
                        user: mongooseToObject(data),
                        title: 'user'
                    })
                next()
            }
        })
    }
}

module.exports = new UserController;

const res = require('express/lib/response');
const userController = require('./UserController');