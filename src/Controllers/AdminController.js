
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Product = require('../models/Product')
const {mongooseToObject, multipleMongooseToObject} = require('../ulti/mongoose')



var secret = 'secretpasstoken'
class AdminController {
    
    // [GET] /index -- Home page
    index(req, res, next){

        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        User.findOne({ _id: decodeToken})
        .then(data => {
            if (data) {
                req.data = data
                // console.log(data)
                return res.render('admin',
                    {
                        user: mongooseToObject(data),
                        layout: 'adminLayout',
                        title: 'Dashboard'
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
        // res.render('partials/error', {
        //     title: 'Not Found',
        //     layout: null
        // });
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        User.findOne({ _id: decodeToken})
        .then(data => {
            if (data) {
                req.data = data
                return res.render('partials/error',
                    {
                        user: mongooseToObject(data),
                        title: 'Not Found',
                        layout: null
                    })
                next()
            }
        })
    }

    // [GET] /admin/user-table
    userTable(req,res,next){
        
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([User.find(), User.findOne({_id:decodeToken})])
        .then(([userList, data]) => {
            if (data) {
                req.data = data
                return res.render('admin/user-table',
                    {
                        user: mongooseToObject(data),
                        userList: multipleMongooseToObject(userList),
                        layout: 'adminLayout',
                        title: 'User Management'
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/login')
        })
        // res.render('admin/user-table', {
        //     title: 'User Table',
        //     layout: 'adminLayout'
        // });
    }

    // [GET] /admin/user-table
    productTable(req,res,next){
        
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([Product.find(), User.findOne({_id:decodeToken})])
        .then(([productList, data]) => {
            if (data) {
                req.data = data
                return res.render('admin/product-table',
                    {
                        user: mongooseToObject(data),
                        productList: multipleMongooseToObject(productList),
                        layout: 'adminLayout',
                        title: 'Product Management'
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/login')
        })
    }
}

module.exports = new AdminController;

const res = require('express/lib/response');
const adminController = require('./AdminController');