
const express = require('express');
const router = express.Router();

const User = require('../models/User')
const {isLoggined, isAdmin, isStaff} = require('../ulti/login')
var cookieParser = require('cookie-parser')
router.use(cookieParser())

const userController = require('../Controllers/UserController');



router.get('/changeps', isLoggined, userController.changeps);
router.post('/updateps', isLoggined, userController.updateps);

router.use('/transfer', isLoggined, userController.transfer);
router.post('/transferToAccount', isLoggined, userController.transferToAccount);

router.put('/:id', isLoggined, userController.update);

router.use('/profile', isLoggined, userController.profile);

router.use('/', isLoggined, userController.index);

module.exports = router;