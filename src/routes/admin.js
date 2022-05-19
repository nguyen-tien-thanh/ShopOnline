const express = require('express');
const router = express.Router();
var cookieParser = require('cookie-parser')
router.use(cookieParser())

const {isLoggined} = require('../ulti/login')

const adminController = require('../Controllers/AdminController');

const User = require('../models/User')



// [GET] /admin/:slug - partials/error.hbs
router.use('/:slug', adminController.error)

// /admin/index - admin.hbs
router.use('/',isLoggined, adminController.index)


module.exports = router;