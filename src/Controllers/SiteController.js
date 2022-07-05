 
const User = require('../models/User')
const Brand = require('../models/Brand')
const Shoetype = require('../models/Shoetype')
const Shoe = require('../models/Shoe')
const Cart = require('../models/Cart')
const Order = require('../models/Order')
const History = require('../models/History')

const { multipleMongooseToObject } = require('../ulti/mongoose')
const { mongooseToObject } = require('../ulti/mongoose')
const { checkUserExist } = require('../ulti/register')
const { makePassword } = require('../ulti/password');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const stripe = require('stripe');


const paypal = require('paypal-rest-sdk');

class SiteController {

    // [GET] /index -- Home page
    index(req, res, next){
        if(req.cookies.token){
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({bestseller: true})
                    .populate('brand')
                    .populate('type')
                    .sort({createdAt: 1})
                    .limit(3),
                Shoe.find({available: true})
                .populate('brand')
                .populate('type')
                .sort({createdAt: 1})
                .limit(3)
            ])
            .then(([
                data,
                brandList,
                shoeType,
                shoeBestseller,
                shoeAvailable
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('index',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            shoeType: multipleMongooseToObject(shoeType),
                            shoeBestseller: multipleMongooseToObject(shoeBestseller),
                            shoeAvailable: multipleMongooseToObject(shoeAvailable),
                            title: 'Home page'
                        })
                    next()
                }
            })
        }
        else {
            Promise.all([
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({bestseller: true})
                    .populate('brand')
                    .populate('type')
                    .sort({createdAt: 1})
                    .limit(3),
                Shoe.find({available: true})
                .populate('brand')
                .populate('type')
                .sort({createdAt: 1})
                .limit(3)
                
            ])
            .then(([
                brandList,
                shoeType,
                shoeBestseller,
                shoeAvailable
            ]) => {
                res.render('index', {
                    shoeBestseller: multipleMongooseToObject(shoeBestseller),
                    shoeAvailable: multipleMongooseToObject(shoeAvailable),
                    title: 'Home page'
                })
            }
            )
        }
    }

    // [GET] /logout --> Home page
    logout (req, res) {
            res.clearCookie('token');
            return res.json({ logout: true , msgLog: 'Log out successfully'})
    }

    //[GET] /authonize User
    authonize(req, res, next){
        res.render('authonize', {
            title:'Authonize',
            layout: 'loginLayout'});
    }

    //[GET] /register User
    register(req, res, next){
        if(!req.cookies.token){
            res.render('register', {
                title:'Register',
                layout: 'loginLayout'});
        }
        else{
            res.redirect('/user/profile')
        }
    }

    //[POST] /store User
    store(req,res,next) {
        User.findOne({
            $or: [
                {email: req.body.email}, 
                {phone: req.body.phone}
            ]
        }).then(data => {
            if(data != null){
                return res.render('register', {
                    title: 'Register',
                    layout: 'loginLayout',
                    msgReg: 'Email or phone is already registered',
                    success: false
                })
            }
            else{
                var temp = req.body.password
                bcrypt.hash(temp, 10, function(err, hash) {
                    const user = new User({
                        role: 'Customer',
                        password: hash,
                        email: req.body.email,
                        phone: req.body.phone,
                        name: req.body.name,
                        birthday: req.body.birthday,
                        address: req.body.address,
                        avatar: 'sample-avatar.jpg'
                    })
                    // console.log(user)
                    user.save(err, result =>{
                        if(err) {
                            console.log('err: ' + err)
                            return res.render('register', {
                                title: 'Login',
                                layout: 'loginLayout',
                                msgReg: 'Failed to register',
                                success: false
                            })
                        }
                        return res.render('register', {
                            title: 'Login',
                            layout: 'loginLayout',
                            msgReg: 'Register Successfully',
                            success: true
                        })
                    })
                })
            }
        })
        .catch(err => console.log(err))

        
    }

    login(req, res, next){
        if(!req.cookies.token){
            res.render('login', {
                title:'Login',
                layout: 'loginLayout',
                msgLog: req.flash('failedMsg')
            });
        }
        else{
            res.redirect('/user/profile')
        }
    }

    //[POST] /validation User
    validation(req,res,next) {
        let username = req.body.username
        let password = req.body.password
        // console.log(username + ' ' + password)

        User.findOne({
            $or: [
                {email: username}, 
                {phone: username}
            ]
        }, (err, user) => {
            if (err) {
                return console.log(err)
            }
            if (!user) {
                // return res.render('login', {
                //     success: false,
                //     layout: 'loginLayout',
                //     msgLog: `Sai tài khoản hoặc mật khẩu`
                // })
                return res.render('login', {
                    success: false,
                    layout: 'loginLayout',
                    title: 'Login again',
                    msgLog: `Wrong username`
                })
            }
            //kiểm tra nếu count = 10 thì là đang khoá tạm thời
            if (user.countFailed == 10) {
                return res.render('login', {
                    success: false,
                    layout: 'loginLayout',
                    title: 'Login again',
                    msgLog: `Account is temporarily locked, please try again in 1 minute`
                })
            }
            //kiểm tra nếu count = 10 thì là đang khoá tạm thời
            if (user.countFailed == 6) {
                return res.render('login', {
                    success: false,
                    layout: 'loginLayout',
                    title: 'Login again',
                    msgLog: `Account has been permanently locked! You have entered the wrong password too many times! Contact admin to reopen the account`
                })
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    var token = jwt.sign({ _id: user._id }, 'secretpasstoken', {})
                    User.updateOne({ username: username }, { $set: { countFailed: 0 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    res.cookie('token',token, { maxAge: 2147483647, httpOnly: true });
                    // return res.render('index',{
                    //     msg: 'Login success',
                    //     title:'Home',
                    //     success: true,
                    //     user: mongooseToObject(user)
                    // })
                    return res.redirect('/')
                }
                const failed = user.countFailed
                console.log(failed)
                if (failed == 2) {
                    //Khoá tạm thời set count = 10
                    User.updateOne({ username: username }, { $set: { countFailed: 10 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })

                    //Mở khoá tài khoản sau 1 phút, trả count về 3
                    var lockAccountOneMinute = setTimeout(function () {
                        User.updateOne({ username: username }, { $set: { countFailed: 3 } }, (err, status) => {
                            if (err) {
                                console.log(err)
                            }
                        })
                        console.log(`unlock ${username} !`)
                    }, 60000);
                    return res.render('login', {
                        success: false,
                        title: 'Login again',
                        layout: 'loginLayout',
                        msgLog: `Account has been locked for 1 minute! If you continue to enter incorrectly 3 more times, you will be locked forever!`
                    })
                } else if (failed >= 5) {
                    User.updateOne({ username: username }, { $set: { countFailed: 6 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    return res.render('login', {
                        success: false,
                        title: 'Login again',
                        layout: 'loginLayout',
                        msgLog: 'Account has been permanently locked! You have entered the wrong password too many times! Contact admin to reopen the account'
                    })
                } else {
                    User.updateOne({ $or: [
                        {email: username}, 
                        {phone: username}
                    ] }, { $set: { countFailed: failed + 1 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    return res.render('login', {
                        success: false,
                        title: 'Login again',
                        layout: 'loginLayout',
                        msgLog: `You have entered the wrong password!!!`
                    })
                }
            });
        })
    }

    // [GET] /:slug
    // Show 404 not found error
    error(req,res,next){
        if(req.cookies.token){
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            User.findOne({
                _id: decodeToken
            }).then(data => {
                if (data) {
                    req.data = data
                    // console.log(data)
                    return res.render('partials/error',
                        {
                            user: mongooseToObject(data),
                            title: 'Not Found',
                            layout: null
                        })
                }
            })
        }
        else{  
            res.render('partials/error', {
                title: 'Not Found',
                layout: null
            });
        }
    }

    // [GET] /cart
    cart(req,res,next){
        if(!req.cookies.token){
            if(!req.session.cart) {
                return res.render('cart', {
                    title: 'Cart',
                    successMsg: req.flash('successMsg'),
                    failedMsg: req.flash('failedMsg')
                })
            }
            else{
                var cart = new Cart(req.session.cart)
                return res.render('cart',
                    {
                        shoe: cart.generateArrays(),
                        totalPrice: cart.totalPrice,
                        title: 'Cart',
                        successMsg: req.flash('successMsg'),
                        failedMsg: req.flash('failedMsg')
                    })
            }
        }
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            if(req.session.cart){
                Promise.all([
                    User.findOne({_id: decodeToken}),
                    Shoe.find({})
                        .populate('brand')
                        .populate('type')
                ])
                .then(([
                    data,
                    shoe,
                ]) => {
                    if (data) {
                        req.data = data
                        var cart = new Cart(req.session.cart)
                        return res.render('cart',
                            {
                                user: mongooseToObject(data),
                                shoe: cart.generateArrays(),
                                totalPrice: cart.totalPrice,
                                title: 'Cart',
                                successMsg: req.flash('successMsg'),
                                failedMsg: req.flash('failedMsg')
                            })
                    }
                })
            }
            else{
                User.findOne({_id: decodeToken})
                .then((user) => res.render('cart',{
                    user: mongooseToObject(user),
                    title: 'Cart',
                    successMsg: req.flash('successMsg'),
                    failedMsg: req.flash('failedMsg')
                }))
            }
        }
    }


    //[POST] /checkout-by-wallet
    checkoutByWallet (req,res,next){
        if(!req.session.cart){
            req.flash('failedMsg','Your cart is empty')
            return res.redirect('/cart');
        }
        else{
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')

            var cartMoney = parseInt(req.body.money)
            
            User.findOne({_id: decodeToken})
            .then((user) =>{
                if(user.money < cartMoney){
                    var history = new History({
                        user: req.body.userId,
                        amount: cartMoney,
                        desc: 'DusTin Wallet',
                        type: 'Pay',
                        status: 'Failed'
                    })
                    history.save()
                    req.flash('failedMsg','You not have enough money to pay')
                    return res.redirect('/cart')
                }
                else{
                    User.updateOne({_id: decodeToken}, {$inc: {money: -cartMoney}})
                    .then((user)=> {
                            var order = new Order({
                                cart: req.session.cart,
                                email: req.body.email,
                                address: req.body.address,
                                phone: req.body.phone,
                                shipping: req.body.shipping
                            })
                            order.save()

                            var history = new History({
                                user: req.body.userId,
                                amount: cartMoney,
                                desc: 'DusTin Wallet',
                                type: 'Pay',
                                status: 'Success'
                            })
                            history.save()
                            
                            req.session.cart = null;
                            req.flash('successMsg','Checkout successfully')
                            return res.redirect('/cart')
                        })
                }
            })
            .catch(err => console.log(err))
        }
    }

    //[POST] /checkout-by-momo
    checkoutByMomo (req,res,next){ 
        if(parseInt(req.session.cart.totalPrice) < 1000 || parseInt(req.session.cart.totalPrice) >50000000){
            res.redirect('/checkout-by-momo-error')
        }
        else{
            var order = new Order({
                cart: req.session.cart,
                email: req.body.email,
                address: req.body.address,
                phone: req.body.phone,
                shipping: req.body.shipping
            })
            var orderParams = JSON.stringify(order)

            var userId = req.body.userId
            var totalPrice = req.session.cart.totalPrice

            var partnerCode = "MOMO";
            var partnerName = req.body.name;
            var accessKey = "F8BBA842ECF85";
            var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            var requestId = partnerCode + new Date().getTime();
            var orderId = requestId;
            var orderInfo = req.body.email +" | DUSTIN pay ";
            var redirectUrl = "http://localhost:5000/checkout-by-momo-success?totalPrice="+ totalPrice + "&userId="+ userId + "&order="+ orderParams + "";
            var ipnUrl =  "http://localhost:5000/checkout-error";
            // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
            var amount = req.body.money;
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
                                +"&partnerName=" + partnerName

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
                    var paymentUrl = JSON.parse(body).payUrl;
                    res.redirect(paymentUrl);
                });
            })
            request.on('error', (e) => {
                console.log(`Problem with payment Momo: ${e.message}`);
            });
            request.write(requestBody);
        }
    }
        checkoutByMomoSuccess(req,res,next){
            if(req.query.message == 'Successful.'){
                var queryOrder = req.query.order
                queryOrder = JSON.parse(queryOrder)
                var order = new Order(queryOrder)
                order.save()
    
                var history = new History({
                    user: req.query.userId,
                    amount: req.query.totalPrice,
                    desc: 'Momo',
                    type: 'Pay',
                    status: 'Success'
                })
                history.save()
                req.session.cart = null;
                req.flash('successMsg','Checkout successfully')
                res.redirect('/cart')
            }
            else{
                var history = new History({
                    user: req.query.userId,
                    amount: req.query.totalPrice,
                    desc: 'Momo',
                    type: 'Pay',
                    status: 'Failed'
                })
                history.save()
                req.flash('failedMsg','Your payment has been paused or canceled')
                res.redirect('/cart')
            }
        }
        checkoutByMomoError(req, res, next){
            req.flash('failedMsg','Momo checkout just accept cart from 1.000 VND to 50.000.000 VND.')
            res.redirect('/cart')
        }

    //[POST] /checkout-by-wallet
    checkoutByPaypal (req,res,next){
        const CILENT_ID_PP = 'AXyT6UqL_3Qgy3UamDrOBwJRj-DNuATs5zK0qwixZ-3AFgS-vrgHernqtpRe7yXhJqCEomWULKdSHeaN'
        const CILENT_SECRET_PP = 'EOoJIOTVFLgdF5-oiz79IMLM6kAqdtoTjnIW5rDMlI6W6rZBaLasMmjP3pDtVI9lv_ldDVh2jX3zTXu0'
        paypal.configure({
            'mode': 'sandbox',
            'client_id': CILENT_ID_PP,
            'client_secret': CILENT_SECRET_PP
        })

        var order = new Order({
            cart: req.session.cart,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            shipping: req.body.shipping
        })

        var userId = req.body.userId
        var totalPrice = req.session.cart.totalPrice

        var orderParams = encodeURIComponent(JSON.stringify(order))

        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:5000/checkout-by-paypal-success?totalPrice="+ totalPrice + "&userId="+ userId + "&order="+ orderParams + "",
                "cancel_url": "http://localhost:5000/checkout-error"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "item",
                        "sku": "item",
                        "price": '2.0',
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": '2.0'
                },
                "description": "Payment for shoes (DusTin)."
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
        checkoutByPaypalSuccess(req,res){
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
                        "total": "2.00"
                    }
                }]
            }
            paypal.payment.execute(paymentId, execute_payment_json, function(err, payment){
                if(err){
                    console.log('Paypal err: '+ err);
                }
                else{
                    var queryOrder = req.query.order
                    queryOrder = JSON.parse(queryOrder)
                    var order = new Order(queryOrder)
                    order.save()

                    var history = new History({
                        user: req.query.userId,
                        amount: req.query.totalPrice,
                        desc: 'Paypal',
                        type: 'Pay',
                        status: 'Success'
                    })
                    history.save()

                    req.session.cart = null;
                    req.flash('successMsg','Checkout successfully')
                    return res.redirect('/cart')
                }
            })
        }

        //GET /checkout-error
        checkoutByPaypalError(req,res){
            var history = new History({
                user: req.query.userId,
                amount: req.query.totalPrice,
                desc: 'Paypal',
                type: 'Pay',
                status: 'Failed'
            })
            history.save()
            req.flash('failedMsg','Your payment has been paused or canceled')
            return res.redirect('/cart')
        }


    //[POST] /checkout-by-card
    checkoutByCard (req,res,next){
        if(!req.session.cart){
            return res.redirect('/cart');
        }
        else{
            var cart = new Cart(req.session.cart);
            const stripe = require('stripe')('sk_test_51LCjUmGXzbc60gITm4NDsulfqX13P2Xy5TjTZzHyhVBjamQt1DMD6pIRvM7elIMFUFI0DUDuh18P5MyN0O18yyZ100setk5tNV');
            
            stripe.customers.create({
                email: req.body.email,
                source: req.body.stripeToken,
                name: req.body.name,
                address: {line1: req.body.address},

            })
            .then((customer) => {
                stripe.charges.create({
                amount: cart.totalPrice,
                currency: 'vnd',
                description: 'Payment for shoes',
                customer: customer.id,
                }, function(err, charge){
                    if(err){
                        console.log(err);
                        req.flash('failedMsg','Checkout Failed');
                        res.redirect('back');
                    }
                    var order = new Order({
                        user: req.user,
                        cart: req.session.cart,
                        email: req.body.email,
                        address: req.body.address,
                        phone: req.body.phone,
                        shipping: req.body.shipping,
                    })
                    order.save()
                    req.session.cart = null;

                    var history = new History({
                        user: req.body.userId,
                        amount: req.body.money,
                        desc: 'Credit Card',
                        type: 'Pay',
                        status: 'Success'
                    })
                    history.save()

                    req.flash('successMsg','Checkout successfully')
                    return res.redirect('/cart')
                })
            })
            .catch((err) => {
                var history = new History({
                    user: req.body.userId,
                    amount: req.body.money,
                    desc: 'Credit Card',
                    type: 'Pay',
                    status: 'Failed'
                })
                history.save()
                req.flash('failedMsg','Can not checkout')
                res.render('partials/error',{
                    layout: null,
                    msg: 'Error: ' + err.message
                })
            })
        }
    }

    
    // [GET] /user/forgotps/
    forgotps(req,res,next){
        return res.render('forgotps',{
            title: 'Forgot Password',
            layout: 'loginLayout',
            msgFail: req.flash('failMessage'),
            msgSuccess: req.flash('successMessage')
        })
    }

    // [POST] /user/forgotps
    forgotpsRequest(req,res,next){
        let temp = makePassword();

        bcrypt.hash(temp, 10, function (err, hash) {
            User.findOneAndUpdate({email:req.body.email}, {$set:{password:hash}})
            .then((user)=>{
                if(!user){
                    req.flash('failMessage', 'Email not found')
                    res.redirect('back')
                }
                else{
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: "nguyentienthanh.tgdd@gmail.com",
                            pass: "fdpcycsrdcumuaar"
                        }
                    });

                    var mailOptions = {
                        from: { name: "DUSTIN-SHOP", address: process.env.GMAIL },
                        to: req.body.email,
                        title: 'Activation Account',
                        subject: 'DUSTIN STORE - Reset Password for Account',
                        text: `Information about this:
                            New password: ${temp}
                        `
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            req.flash('failMessage', 'Can not send email. Please try again')
                            console.log(error);
                        } else {
                            req.flash('successMessage', 'New password has sent to' + req.body.email)
                            console.log('Email sent: ' + info.response);
                            res.redirect('back')
                        }
                    });
                }
            })
            .catch(err => console.log(err))
        });
    }
}

module.exports = new SiteController;

const res = require('express/lib/response');
const siteController = require('./SiteController');