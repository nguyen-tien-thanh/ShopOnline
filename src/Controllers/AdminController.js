
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Brand = require('../models/Brand')
const Shoetype = require('../models/Shoetype')
const Shoe = require('../models/Shoe')
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


    // [GET] /admin/brand-table
    brandTable(req,res,next){      
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([Brand.find({}).sort({'createdAt': -1}), 
            Brand.findDeleted({}).sort({'createdAt': -1}),
            User.findOne({_id:decodeToken})])
        .then(([brandList, 
            brandDeletedList,
            data]) => {
            if (data) {
                req.data = data
                return res.render('admin/brand-table',
                    {
                        user: mongooseToObject(data),
                        brandDeletedList: multipleMongooseToObject(brandDeletedList),
                        brandList: multipleMongooseToObject(brandList),
                        layout: 'adminLayout',
                        title: 'Brand Management'
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/login')
        })
    }


    // [GET] /admin/shoetype-table
    shoetypeTable(req,res,next){      
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([Shoetype.find(), Shoetype.findDeleted(), User.findOne({_id:decodeToken})])
        .then(([shoetypeList, shoetypeDeleted, data]) => {
            if (data) {
                req.data = data
                return res.render('admin/shoetype-table',
                    {
                        user: mongooseToObject(data),
                        shoetypeList: multipleMongooseToObject(shoetypeList),
                        shoetypeDeleted: multipleMongooseToObject(shoetypeDeleted),
                        layout: 'adminLayout',
                        title: 'Shoe Type',
                        deletedTitle: 'Deleted Types'
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/login')
        })
    }

    // [GET] /admin/shoe-table
    shoeTable(req,res,next){      
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([
            User.findOne({_id:decodeToken}),
            Shoe.find().populate('brand').populate('type'), 
            Shoe.findDeleted().populate('brand').populate('type'), 
            Brand.find({}),
            Shoetype.find({})
        ])
        .then(([
            data,
            shoeList, 
            shoeDeleted, 
            brandList,
            shoetypeList
        ]) => {
            if (data) {
                req.data = data
                return res.render('admin/shoe-table',
                    {
                        user: mongooseToObject(data),
                        shoeList: multipleMongooseToObject(shoeList),
                        shoeDeleted: multipleMongooseToObject(shoeDeleted),
                        brandList: multipleMongooseToObject(brandList),
                        shoetypeList: multipleMongooseToObject(shoetypeList),
                        layout: 'adminLayout',
                        title: 'Shoe',
                        deletedTitle: 'Deleted Shoe'
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/login')
        })
    }


    // [GET] /admin/edit-user/:id
    editUser(req, res, next) {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([User.findOne({_id: req.params.id}), User.findOne({_id:decodeToken})])
        .then(([userEdit, data]) => {
            if (data) {
                req.data = data
                return res.render('admin/edit-user',
                    {
                        user: mongooseToObject(data),
                        userEdit: mongooseToObject(userEdit),
                        layout: 'adminLayout',
                        title: 'Edit user information',
                        msg: req.flash('successMsg')
                    })
            }
        })
        .catch((error) => {
            req.flash('failedMsg', 'Can not edit this user information')
            res.redirect('back')
        })
    }

    // [PUT] /admin/edit-user/:id
    putUser(req,res,next){
        User.updateOne({_id: req.params.id}, req.body)
            .then(() => {
                req.flash('successMsg', 'Updated user information successfully')
                res.redirect('back')
            })
            .catch(err => {
                req.flash('failedMsg', 'Updated user information failed')
                res.redirect('back')
            });
    }

}

module.exports = new AdminController;

const res = require('express/lib/response');
const adminController = require('./AdminController');