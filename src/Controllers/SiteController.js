

   
const User = require('../models/User')
const { multipleMongooseToObject } = require('../ulti/mongoose')
const { mongooseToObject } = require('../ulti/mongoose')
const { checkUserExist, makePassword } = require('../ulti/register')
const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


class SiteController {

    // [GET] /index -- Home page
    index(req, res, next){
        if(req.cookies.token){
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            User.findOne({
                _id: decodeToken
            }).then(data => {
                if (data) {
                    req.data = data
                    console.log(data)
                    return res.render('index',
                        {
                            user: mongooseToObject(data),
                            title: 'Home page'
                        })
                    next()
                }
            })
        }
        else{
            res.render('index', {
                title: 'Home page',
            })
        }
    }

    // [GET] /logout --> Home page
    logout (req, res) {
        // req.logout();
        // delete req.session;
        // return res.render('login',{
        //     msgLog: 'You need to login first',
        //     layout: 'loginLayout',
        //     title: 'Login'
        // })
            req.session = null
            res.json({ logout: true })
    }

    //[GET] /authonize User
    authonize(req, res, next){
        res.render('authonize', {
            title:'Authonize',
            layout: 'loginLayout'});
    }

    // //[GET] /validation User
    // validation(req, res, next){
    //     res.render('validation', {
    //         title:'Validation',
    //         layout: 'loginLayout'});
    // }

    //[GET] /register User
    register(req, res, next){
        res.render('register', {
            title:'Register',
            layout: 'loginLayout'});
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
                        avatar: 'https://duytan.thinkingschool.vn/wp-content/uploads/2019/01/avatar.png'
                    })
                    console.log(user)
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
        res.render('login', {
            title:'Login',
            layout: 'loginLayout'});
    }

    //[POST] /validation User
    validation(req,res,next) {
        let username = req.body.username
        let password = req.body.password

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
                    msgLog: `Sai tài khoản hoặc mật khẩu`
                })
            }
            //kiểm tra nếu count = 10 thì là đang khoá tạm thời
            if (user.countFailed == 10) {
                return res.render('login', {
                    success: false,
                    layout: 'loginLayout',
                    msgLog: `Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút`
                })
            }
            //kiểm tra nếu count = 10 thì là đang khoá tạm thời
            if (user.countFailed == 6) {
                return res.render('login', {
                    success: false,
                    layout: 'loginLayout',
                    msgLog: `Tài khoản đã bị khoá vĩnh viễn! Bạn đã nhập sai mật khẩu quá nhiều lần! Liên hệ admin để mở lại tài khoản`
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
                    // return res.json({token: token, success: true, msgLog:'Login Successful'})
                    res.cookie('token',token, { maxAge: 900000, httpOnly: true });
                    return res.render('index',{
                        // layout: 'adminLayout',
                        msg: 'Login success',
                        success: true,
                        user: mongooseToObject(user)
                    })
                }
                const failed = user.countFailed
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
                        layout: 'loginLayout',
                        msgLog: `Tài khoản đã bị khoá trong 1 phút! Nếu bạn tiếp tục nhập sai thêm 3 lần nữa sẽ bị khoá vĩnh viễn!`
                    })
                } else if (failed >= 5) {
                    User.updateOne({ username: username }, { $set: { countFailed: 6 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    return res.render('login', {
                        success: false,
                        layout: 'loginLayout',
                        msgLog: 'Tài khoản đã bị khoá vĩnh viễn! Bạn đã nhập sai mật khẩu quá nhiều lần! Liên hệ admin để mở lại tài khoản'
                    })
                } else {
                    User.updateOne({ username: username }, { $set: { countFailed: failed + 1 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    return res.render('login', {
                        success: false,
                        layout: 'loginLayout',
                        msgLog: `Bạn đã nhập sai mật khẩu ${failed + 1} lần!!!`
                    })
                }
            });
        })
    }

    // [GET] /:slug
    // Show 404 not found error
    error(req,res,next){
        res.render('partials/error', {
            title: 'Not Found',
            layout: null
        });
    }

}

module.exports = new SiteController;

const res = require('express/lib/response');
const siteController = require('./SiteController');