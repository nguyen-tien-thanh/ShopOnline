const User = require('../models/User')


function checkUserExist(username) {
    User.findOne({ username: username }).then(data => {
        return true
    }).catch(err => {
        console.log(err)
    })
    return false
}

module.exports = {checkUserExist}