
const cookieParser = require('cookie-parser')
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const { mongooseToObject } = require('./mongoose');

const secret = 'secretpasstoken'

function isLoggined(req, res, next) {
    try {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        User.findOne({_id: decodeToken})
        .then(data => {
            if (data) {
                req.data = data
                console.log(data)
                next()
            }
        })
        .catch(err => {
            console.log(err)
            res.redirect('/')
        })
    } catch (error) {
        console.log(error)
        return res.render('login',{
            msgLog: 'You need to login first',
            layout: 'loginLayout',
            title: 'Login'
        })
    }
}

function isAdmin(req,res,next){
    if(req.data.role !== 'Admin'){
        User.findOne({name: req.data.name})
            .then (user =>{
            res.render('partials/error', {
                title: 'Error',
                layout: null,
                roleNofitication: 'This is Admin page. You are not allowed !',
            })
        })
    }
    next()
}

function isStaff(req,res,next){
    if(req.data.role !== 'Staff'){
        User.findOne({name: req.data.name})
            .then (user =>{
            res.render('partials/error', {
                title: 'Error',
                layout: null,
                roleNofitication: 'This is Staff page. You are not allowed !',
            })
        })
    }
    next()
}

module.exports = {isLoggined,isAdmin, isStaff}

