

const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Brand = require('../models/Brand')
const Shoetype = require('../models/Shoetype')
const Shoe = require('../models/Shoe')
const History = require('../models/History')
const {mongooseToObject, multipleMongooseToObject} = require('../ulti/mongoose')

const bcrypt = require('bcrypt');
var secret = 'secretpasstoken'
const stripe = require('stripe');
const paypal = require('paypal-rest-sdk');

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
        User.findOneAndUpdate({_id: req.params.id}, {$set: req.body})
            .then(() => {
                req.flash('successMsg', 'Your profile information has been updated'),
                res.redirect('/user/profile')
            })
            .catch(next);
    }

    // [POST] /user/change-avatar
    changeAvatar(req, res, next) {
        User.findOneAndUpdate({_id: req.params.id}, {$set: {avatar: req.file.filename}})
            .then(() => {
                req.flash('successMsg', 'Your avatar has been updated'),
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
    transferByCard(req, res, next){
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        User.findOneAndUpdate({ _id: decodeToken}, {$inc : {money: req.body.money}})
        .then(data => {
            if (data) {
                req.data = data
                var history = new History({
                    user: decodeToken,
                    amount: req.body.money,
                    desc: 'Credit Card',
                    type: 'Transfer',
                    status: 'Success'
                })
                history.save()
                req.flash('successMsg', 'Transfer Successfully')
                return res.redirect('back')
            }
            else{
                req.flash('failMsg', 'Transfer Failed')
                return res.redirect('back')
            }
        })
    }

    // [POST] /user/transfer-by-momo
    transferByMomo(req,res,next){
        if(parseInt(req.body.money) < 1000 || parseInt(req.body.money) >50000000){
            res.redirect('/user/transfer-by-momo-error')
        }
        else{
            console.log(req.body.name)
            var userId = req.body.userId
            var amount = req.body.money;

            var partnerCode = "MOMO";
            var accessKey = "F8BBA842ECF85";
            var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            var requestId = partnerCode + new Date().getTime();
            var orderId = requestId;
            var orderInfo = "Transfer | DUSTIN";
            var redirectUrl = "http://localhost:5000/user/transfer-by-momo-success?userId="+ userId + "&money=" + amount + "";
            var ipnUrl =  "http://localhost:5000/checkout-error";
            // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
            var requestType = "captureWallet"
            var extraData = "";

            var rawSignature = "accessKey="+accessKey
                                +"&amount=" + amount
                                +"&extraData=" + extraData
                                +"&ipnUrl=" + ipnUrl
                                +"&orderId=" + orderId
                                +"&orderInfo=" + orderInfo
                                +"&partnerCode=" + partnerCode 
                                +"&redirectUrl=" + redirectUrl
                                +"&requestId=" + requestId
                                +"&requestType=" + requestType

            const crypto = require('crypto');
            var signature = crypto.createHmac('sha256', secretkey)
                .update(rawSignature)
                .digest('hex');

            const requestBody = JSON.stringify({
                partnerCode : partnerCode,
                accessKey : accessKey,
                requestId : requestId,
                amount : amount,
                orderId : orderId,
                orderInfo : orderInfo,
                redirectUrl : redirectUrl,
                ipnUrl : ipnUrl,
                extraData : extraData,
                requestType : requestType,
                signature : signature,
                lang: 'en'
            });

            //Create the HTTPS objects
            const https = require('https');
            const options = {
                hostname: 'test-payment.momo.vn',
                port: 443,
                path: '/v2/gateway/api/create',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody)
                }
            }
            //Send the request and get the response
            const request = https.request(options, response => {
                response.setEncoding('utf8');
                response.on('data', (body) => {
                    var transferUrl = JSON.parse(body).payUrl;
                    res.redirect(transferUrl);
                });
            })
            request.on('error', (e) => {
                console.log(`Problem with transfer Momo: ${e.message}`);
            });
            request.write(requestBody);
        }
    }
        // [GET] /user/transfer-by-momo-success
        transferByMomoSuccess(req,res,next){
            var money = parseInt(req.params.money)
            if(req.query.message == 'Successful.'){
                User.findOneAndUpdate({_id: req.query.userId}, {$inc: {money: money}})
                .then((user) =>{
                    var history = new History({
                        user: user._id,
                        amount: money,
                        desc: 'Momo',
                        type: 'Transfer',
                        status: 'Success'
                    })
                    history.save()
                    req.flash('successMsg','Transfer successfully')
                    res.redirect('/user/transfer')
                })
                .catch(err => {console.log(err)})
            }
            else{
                var history = new History({
                    user: req.query.userId,
                    amount: money,
                    desc: 'Momo',
                    type: 'Transfer',
                    status: 'Failed'
                })
                history.save()
                req.flash('failedMsg','Transfer has been paused or canceled')
                res.redirect('/user/transfer')
            }
        }
        //[GET] /user/transfer-by-momo-error
        transferByMomoError(req,res,next){
            req.flash('failedMsg','The money must be between 1.000 VND and 50.000.000 VND.')
            res.redirect('/user/transfer')
        }

    //[POST] /transfer-by-wallet
    transferByPaypal (req,res,next){
        const CILENT_ID_PP = 'AXyT6UqL_3Qgy3UamDrOBwJRj-DNuATs5zK0qwixZ-3AFgS-vrgHernqtpRe7yXhJqCEomWULKdSHeaN'
        const CILENT_SECRET_PP = 'EOoJIOTVFLgdF5-oiz79IMLM6kAqdtoTjnIW5rDMlI6W6rZBaLasMmjP3pDtVI9lv_ldDVh2jX3zTXu0'
        paypal.configure({
            'mode': 'sandbox',
            'client_id': CILENT_ID_PP,
            'client_secret': CILENT_SECRET_PP
        })

        var userId = req.body.userId
        var amount = parseInt(req.body.money)

        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:5000/user/transfer-by-paypal-success?amount="+ amount + "&userId="+ userId + "",
                "cancel_url": "http://localhost:5000/user/transfer-by-paypal-error"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "item",
                        "sku": "item",
                        "price": amount,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": amount
                },
                "description": "Transfer to wallet (DusTin)."
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                for(let i = 0; i < payment.links.length; i++) {
                    if(payment.links[i].rel === 'approval_url'){
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });
    }

        //GET /check-out-by-paypal-success
        transferByPaypalSuccess(req,res){
            const CILENT_ID_PP = 'AXyT6UqL_3Qgy3UamDrOBwJRj-DNuATs5zK0qwixZ-3AFgS-vrgHernqtpRe7yXhJqCEomWULKdSHeaN'
            const CILENT_SECRET_PP = 'EOoJIOTVFLgdF5-oiz79IMLM6kAqdtoTjnIW5rDMlI6W6rZBaLasMmjP3pDtVI9lv_ldDVh2jX3zTXu0'
            paypal.configure({
                'mode': 'sandbox',
                'client_id': CILENT_ID_PP,
                'client_secret': CILENT_SECRET_PP
            })

            const payerId = req.query.PayerID;
            const paymentId = req.query.paymentId;

            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount":{
                        "currency": "USD",
                        "total": req.query.amount
                    }
                }]
            }


            var amount = parseInt(req.query.amount)
            User.findOneAndUpdate({_id: req.query.userId}, {$inc: {money: amount}})
            .then((user)=>{
                paypal.payment.execute(paymentId, execute_payment_json, function(err, payment){
                    if(err){
                        console.log('Paypal err: '+ err);
                    }
                    else{
                        var history = new History({
                            user: user._id,
                            amount: amount,
                            desc: 'Paypal',
                            type: 'Transfer',
                            status: 'Success'
                        })
                        history.save()
                        
                        req.flash('successMsg','Transfer successfully')
                        return res.redirect('/user/transfer')
                    }
                })
            })
        }

        //GET /transfer-error
        transferByPaypalError(req,res){
            var history = new History({
                user: req.query.userId,
                amount: req.query.totalPrice,
                desc: 'Paypal',
                type: 'Transfer',
                status: 'Failed'
            })
            history.save()
            req.flash('failedMsg','Your transfer has been paused or canceled')
            return res.redirect('/user/transfer')
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
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([
            User.findOne({ _id: decodeToken}), 
            History.find({ user: decodeToken}).sort({createdAt: -1})
        ])
        .then(([data, history]) => {
            if (data) {
                req.data = data
                return res.render('user/history',
                    {
                        user: mongooseToObject(data),
                        history: multipleMongooseToObject(history),
                        title: 'History',
                        layout: 'accountLayout',
                        titleSection: 'My Account',
                        section: 'history',
                        msg: req.flash('successMsg')
                    })
            }
        }) 
    }
}

module.exports = new UserController;

const res = require('express/lib/response');
const userController = require('./UserController');