
const cookieParser = require('cookie-parser')
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const secret = 'secretpasstoken'

function isLoggined(req, res, next) {
    try {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        User.findOne({_id: decodeToken})
        .then(data => {
            if (data) {
                req.data = data
                // console.log(data)
                next()
            }
        })
        .catch(err => {
            console.log(err)
            res.redirect('/')
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/authonize')
    }
}

module.exports = {isLoggined}

