
const express = require('express');
const router = express.Router();

const User = require('../models/User')
const {isLoggined, isAdmin, isStaff} = require('../ulti/login')
var cookieParser = require('cookie-parser')
router.use(cookieParser())

const userController = require('../Controllers/UserController');

router.get('/history', isLoggined, userController.history);

router.get('/ban/:id', isLoggined, isAdmin, userController.ban);
router.get('/unban/:id', isLoggined, isAdmin, userController.unban);

router.get('/changeps', isLoggined, userController.changeps);
router.post('/updateps', isLoggined, userController.updateps);

router.use('/transfer', isLoggined, userController.transfer);
router.post('/transfer-by-card', isLoggined, userController.transferByCard);
router.post('/transfer-by-momo', isLoggined, userController.transferByMomo);
    router.get('/transfer-by-momo-success', userController.transferByMomoSuccess);
router.post('/transfer-by-paypal', isLoggined, userController.transferByPaypal);
    router.get('/transfer-by-paypal-success', userController.transferByPaypalSuccess);
    router.get('/transfer-by-paypal-error', userController.transferByPaypalError);

router.post('/update/:id', isLoggined, userController.update);
router.post('/change-avatar/:id', isLoggined, userController.changeAvatar);

router.use('/profile', isLoggined, userController.profile);

router.use('/', isLoggined, userController.index);

module.exports = router;