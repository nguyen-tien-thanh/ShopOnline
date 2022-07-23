
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Brand = require('../models/Brand')
const Shoetype = require('../models/Shoetype')
const Shoe = require('../models/Shoe')
const Notification = require('../models/Notification')

const {mongooseToObject, multipleMongooseToObject} = require('../ulti/mongoose')



var secret = 'secretpasstoken'
class AdminController {
    
    // [GET] /index -- Home page
    index(req, res, next){

        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([
        User.findOne({ _id: decodeToken}),
        Notification.find({user: decodeToken})
            // .limit(4)
            .sort({isRead: 1, createdAt: -1}),
        ])
        .then(([data,noti]) => {
            if (data) {
                req.data = data
                return res.render('admin',
                    {
                        user: mongooseToObject(data),
                        noti: multipleMongooseToObject(noti),
                        layout: 'adminLayout',
                        title: 'Dashboard'
                    })
                next()
            }
        })
    }

    // [GET] /:slug
    // Show 404 not found error
    error(req,res,next){
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)

        Promise.all([
        User.findOne({ _id: decodeToken}),
        Notification.find({user: decodeToken})
            // .limit(4)
            .sort({createdAt: -1}),
        ])
        .then(([data,noti]) => {
            if (data) {
                req.data = data
                return res.render('partials/error',
                    {
                        user: mongooseToObject(data),
                        noti: multipleMongooseToObject(noti),
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
        Promise.all([
            User.find(), 
            User.findOne({_id:decodeToken}),
            Notification.find({user: decodeToken})
                // .limit(4)
                .sort({createdAt: -1}),
        ])
        .then(([userList, data, noti]) => {
            if (data) {
                req.data = data
                return res.render('admin/user-table',
                    {
                        user: mongooseToObject(data),
                        userList: multipleMongooseToObject(userList),
                        noti: multipleMongooseToObject(noti),
                        layout: 'adminLayout',
                        title: 'User Management'
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/login')
        })
    }


    // [GET] /admin/brand-table
    brandTable(req,res,next){      
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([
            Brand.find({}).sort({'createdAt': -1}), 
            Brand.findDeleted({}).sort({'createdAt': -1}),
            User.findOne({_id:decodeToken}),
            Notification.find({user: decodeToken})
                // .limit(4)
                .sort({createdAt: -1}),
            ])
        .then(([
            brandList, 
            brandDeletedList,
            data,
            noti
        ]) => {
            if (data) {
                req.data = data
                return res.render('admin/brand-table',
                    {
                        user: mongooseToObject(data),
                        brandDeletedList: multipleMongooseToObject(brandDeletedList),
                        brandList: multipleMongooseToObject(brandList),
                        noti: multipleMongooseToObject(noti),
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
        Promise.all([
            Shoetype.find(), 
            Shoetype.findDeleted(), 
            User.findOne({_id:decodeToken}),
            Notification.find({user: decodeToken})
                // .limit(4)
                .sort({createdAt: -1}),
        ])
        .then(([shoetypeList, shoetypeDeleted, data, noti]) => {
            if (data) {
                req.data = data
                return res.render('admin/shoetype-table',
                    {
                        user: mongooseToObject(data),
                        shoetypeList: multipleMongooseToObject(shoetypeList),
                        shoetypeDeleted: multipleMongooseToObject(shoetypeDeleted),
                        noti: multipleMongooseToObject(noti),
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
            Shoetype.find({}),
            Notification.find({user: decodeToken})
                // .limit(4)
                .sort({createdAt: -1}),
        ])
        .then(([
            data,
            shoeList, 
            shoeDeleted, 
            brandList,
            shoetypeList,
            noti
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
                        noti: multipleMongooseToObject(noti),
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
        Promise.all([
            User.findOne({_id: req.params.id}), 
            User.findOne({_id:decodeToken}),
            Notification.find({user: decodeToken})
                // .limit(4)
                .sort({createdAt: -1}),
            ])
        .then(([userEdit, data, noti]) => {
            if (data) {
                req.data = data
                return res.render('admin/edit-user',
                    {
                        user: mongooseToObject(data),
                        userEdit: mongooseToObject(userEdit),
                        noti: multipleMongooseToObject(noti),
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