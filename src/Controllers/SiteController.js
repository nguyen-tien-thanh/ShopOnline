

   
const User = require('../models/User')
const { multipleMongooseToObject } = require('../ulti/mongoose')
const { mongooseToObject } = require('../ulti/mongoose')
const { checkUserExist, makePassword } = require('../ulti/register')
const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');
class SiteController {

    // [GET] /index -- Home page
    index(req, res, next){
        res.render('index', {
            title: 'Home page'
        })
        // if (req.isAuthenticated()) {
        //     User.findOne({username: req.user.username})
        //     .then (user =>{
        //         res.render('index', {
        //             layout: 'intropage', 
        //             userLogin: mongooseToObject(user)
        //         });
        //     })
        // }
        // else{
            
        // res.render('index', {
        //     title:'Homepage',
        //     layout: 'intropage'});
        // }
    }

    // // [GET] /logout --> Home page
    // logout (req, res) {
    //     req.logout();
    //     res.redirect('login');
    // }

    // contact(req, res,next){
    //     if (req.isAuthenticated()) {
    //         User.findOne({username: req.user.username})
    //         .then (user =>{
    //             res.render('contact', { 
    //                 title: 'Contact',
    //                 userLogin: mongooseToObject(user)
    //             });
    //         })
    //     }
    //     else{
    //         res.render('contact', {title:'Contact'})
    //     }
    // }

    // register(req, res, next){
    //     res.render('register', {title: 'Register',layout: 'intropage'});
    // }

    //[POST] /store User
    store(req,res,next) {
        User.findOne({
            $or: [
                {email: req.body.email}, 
                {phone: req.body.phone}
            ]
        }).then(data => {
            if(data != null){
                return res.render('login', {
                    title: 'Login',
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
                        avatar: 'https://duytan.thinkingschool.vn/wp-content/uploads/2019/01/avatar.png'
                    })
                    console.log(user)
                    user.save(err, result =>{
                        if(err) {
                            console.log('err: ' + err)
                            return res.render('login', {
                                title: 'Login',
                                layout: 'loginLayout',
                                msgReg: 'Failed to register',
                                success: false
                            })
                        }
                        return res.render('login', {
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

        User.findOne({ username: username }, (err, user) => {
            if (err) {
                return console.log(err)
            }
            if (!user) {
                return res.render('login', {
                    success: false,
                    msg: `Sai tài khoản hoặc mật khẩu`
                })
            }
            //kiểm tra nếu count = 10 thì là đang khoá tạm thời
            if (user.countFailed == 10) {
                return res.render('login', {
                    success: false,
                    msg: `Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút`
                })
            }
            //kiểm tra nếu count = 10 thì là đang khoá tạm thời
            if (user.countFailed == 6) {
                return res.render('login', {
                    success: false,
                    msg: `Tài khoản đã bị khoá vĩnh viễn! Bạn đã nhập sai mật khẩu quá nhiều lần! Liên hệ admin để mở lại tài khoản`
                })
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    var token = jwt.sign({ _id: user._id }, 'secretpasstoken', { expiresIn: '30m' })
                    User.updateOne({ username: username }, { $set: { countFailed: 0 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    //Tạo ra 2 cái render theo role(Customer, Admin)
                    // Của Customer thì đẩy về Index tổng `localhost:3000/`
                    // Của Admin thì đẩy về Index Admin `localhost:3000/Admin`
                    //Dùng Promise All để đẩy database của người dùng theo ID của token lên 
                    //==> Tìm đc tên người dùng để hiển thị ở navbar với footer (của admin)
                    return res.render('changePassword')
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
                        msg: `Tài khoản đã bị khoá trong 1 phút! Nếu bạn tiếp tục nhập sai thêm 3 lần nữa sẽ bị khoá vĩnh viễn!`
                    })
                } else if (failed >= 5) {
                    User.updateOne({ username: username }, { $set: { countFailed: 6 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    return res.render('login', {
                        success: false,
                        msg: 'Tài khoản đã bị khoá vĩnh viễn! Bạn đã nhập sai mật khẩu quá nhiều lần! Liên hệ admin để mở lại tài khoản'
                    })
                } else {
                    User.updateOne({ username: username }, { $set: { countFailed: failed + 1 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    return res.render('login', {
                        success: false,
                        msg: `Bạn đã nhập sai mật khẩu ${failed + 1} lần!!!`
                    })
                }
            });
        })

    //     // var username = req.body.username;
    //     // var password = req.body.password;

    //     // User.findOne({username: username}).then(function(user) {
    //     //     if(user){
    //     //       if (user.password == password){
    //     //           console.log('User connected');
    //     //           req.session.username = username;
    //     //           req.session.password = password;
    //     //           console.log(req.session);
    //     //         //   res.status(200).send('User Authentified');
    //     //       }else{
    //     //           res.status(401).send('Invalid Password');
    //     //       }
    //     //   }else{
    //     //       res.status(401).send('Username');
    //     //   }
    //     // });
    //     passport.authenticate("local")(
    //         req, res, function () {
    //             User.findOne({username: req.user.username})
    //                 .then (user =>{
    //                     res.render('index', { 
    //                         title: 'Homepage',
    //                         layout: 'intropage',
    //                         userLogin: mongooseToObject(user)
    //                     });
    //                 })
    //     });
    }

    // [GET] /:slug
    // Show 404 not found error
    error(req,res,next){
    //     if (req.isAuthenticated()) {
    //         User.findOne({username: req.user.username})
    //         .then (user =>{
    //             res.render('partials/error', { 
    //                 title: 'Not Found',
    //                 userLogin: mongooseToObject(user)
    //             });
    //         })
    //     }
    //     else{
            res.render('partials/error', {
                title: 'Not Found',
                layout: null
            });
    //     }
    }

    // termsandconditions(req, res, next){
    //     if (req.isAuthenticated()) {
    //         User.findOne({username: req.user.username})
    //         .then (user =>{
    //             res.render('termsandconditions', { 
    //                 title: 'Terms',
    //                 userLogin: mongooseToObject(user)
    //             });
    //         })
    //     }
    //     else{
    //         res.render('termsandconditions', {title: 'Terms' })
    //     }
    // }

    // secret(req,res,next){
    //     if (req.isAuthenticated()) {
    //         User.findOne({username: req.user.username})
    //         .then (user =>{
    //             res.render('secret', { 
    //                 title: 'secret',
    //                 userLogin: mongooseToObject(user)
    //             });
    //         })
    //     }
    //     else{
    //         res.render('secret', {title: 'Secret' })
    //     }
    // }

}

module.exports = new SiteController;

const res = require('express/lib/response');
const siteController = require('./SiteController');