
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const {mongooseToObject, multipleMongooseToObject} = require('../ulti/mongoose')

class AdminController {
    
    // [GET] /index -- Home page
    index(req, res, next){

        var token = req.cookies.token;
        var secret = 'secretpasstoken'
        var decodeToken = jwt.verify(token, secret)
        User.findOne({ _id: decodeToken})
        .then(data => {
            if (data) {
                req.data = data
                console.log(data)
                return res.render('admin',
                    {
                        user: mongooseToObject(data),
                        layout: 'adminLayout'
                    })
                next()
            }
        })
    }

    // // [GET] /logout --> Home page
    // logout (req, res) {
    //     req.logout();
    //     res.redirect('login');
    // }

    // [GET] /:slug
    // Show 404 not found error
    error(req,res,next){
            res.render('partials/error', {
                title: 'Not Found',
                layout: null
            });
    }
}

module.exports = new AdminController;

const res = require('express/lib/response');
const adminController = require('./AdminController');