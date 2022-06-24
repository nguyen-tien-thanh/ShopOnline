

const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Brand = require('../models/Brand')
const Shoetype = require('../models/Shoetype')
const Shoe = require('../models/Shoe')
const Product = require('../models/Product')
const {mongooseToObject, multipleMongooseToObject} = require('../ulti/mongoose')

const bcrypt = require('bcrypt');
var secret = 'secretpasstoken'
const stripe = require('stripe');
class UserController {

    // [GET] /user/unban/:id
    ban(req,res,next){
        User.updateOne({_id: req.params.id}, { $set: {countFailed: 6}})
            .then(() =>{
                req.flash('successMsg','This user has been unban')
                res.redirect('back')
            })
            .catch(next);
    }

    // [GET] /user/unban/:id
    unban(req,res,next){
        User.updateOne({_id: req.params.id}, { $set: {countFailed: 0}})
            .then(() =>{
                req.flash('successMsg','This user has been unban')
                res.redirect('back')
            })
            .catch(next);
    }
    

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
                        title: 'My Profile',
                        layout: 'accountLayout',
                        titleSection: 'My Account',
                        section: 'profile',
                        msg: req.flash('successMsg')
                    })
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
                        layout: 'accountLayout',
                        titleSection: 'My Account',
                        section: 'changeps',
                        successMsg: req.flash('successMsg'),
                        failedMsg: req.flash('failedMsg')
                    })
            }
        })
    }


    // [POST] /user/updateps
    updateps(req,res,next){
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)

        const oldPassword = req.body.oldps
        const newPassword = req.body.newps
        const confirmPassword = req.body.confirmps

        User.findOne({ _id: decodeToken})
        .then(user => {
            bcrypt.compare(oldPassword, user.password, function (err,result) {
                if(result) {
                    if (newPassword != confirmPassword) {
                        req.flash('failedMsg', 'Password does not match'),
                            res.redirect('/user/changeps')
                        } 
                    else if(oldPassword == newPassword){
                        req.flash('failedMsg', 'Password must not be the same as the old password'),
                            res.redirect('/user/changeps')
                        }
                    else {
                        bcrypt.hash(newPassword, 10, function (error, hash) {
                            if (error) {
                                req.flash('failedMsg', 'Change password failed'),
                                    res.redirect('/user/changeps')
                            }
                            User.updateOne({ _id: decodeToken }, { $set: { password: hash } }, (err, status) => {
                                if(err){
                                    req.flash('failedMsg', 'Change password failed'),
                                        res.redirect('/user/changeps')
                                }
                                req.flash('successMsg', 'Change password successfully'),
                                    res.redirect('/user/changeps')
                            })
                        });
                    }
                }else{
                    return req.flash('failedMsg', 'Old password is invalid'),
                        res.redirect('/user/changeps')
                }
            })
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
                        layout: 'accountLayout',
                        titleSection: 'My Account',
                        section: 'transfer',
                        successMsg: req.flash('successMsg'),
                        failedMsg: req.flash('failedMsg')
                    })
                next()
            }
        })
    }

    // [POST] /user/transfer
    transferToAccount(req, res, next){
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        User.findOneAndUpdate({ _id: decodeToken}, {$inc : {money: req.body.money}})
        .then(data => {
            if (data) {
                req.data = data
                req.flash('successMsg', 'Transfer Successfully')
                return res.redirect('back')
            }
            else{
                req.flash('failMsg', 'Transfer Failed')
                return res.redirect('back')
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

    // [GET] /history
    history(req, res, next){
        const stripe = require('stripe')('sk_test_51LCjUmGXzbc60gITm4NDsulfqX13P2Xy5TjTZzHyhVBjamQt1DMD6pIRvM7elIMFUFI0DUDuh18P5MyN0O18yyZ100setk5tNV');

        const transactions = stripe.issuing.transactions.list({
            limit: 3,
          });
        console.log(transactions)
    }
}

module.exports = new UserController;

const res = require('express/lib/response');
const userController = require('./UserController');