const express = require('express');
const router = express.Router();

const User = require('../models/User')
const {isLoggined} = require('../ulti/login')
var cookieParser = require('cookie-parser')
router.use(cookieParser())

const adminController = require('../Controllers/AdminController');


// [GET] /admin/product-table - ./admin/product-table
router.use('/product-table', adminController.productTable)

// [GET] /admin/user-table - ./admin/user-table
router.use('/user-table', adminController.userTable)

// [GET] /admin/:slug - partials/error.hbs
router.use('/:slug', adminController.error)

// /admin/index - admin.hbs
router.use('/', isLoggined, adminController.index)


module.exports = router;