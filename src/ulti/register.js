const User = require('../models/User')


function checkUserExist(username) {
    User.findOne({ username: username }).then(data => {
        return true
    }).catch(err => {
        console.log(err)
    })
    return false
}


function makePassword() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength))
    }
    return result
}
module.exports = {makePassword,checkUserExist}