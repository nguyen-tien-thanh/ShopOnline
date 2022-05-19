const express = require('express');
const router = express.Router();

const siteController = require('../Controllers/SiteController');

const {isLoggined} = require('../ulti/login')
var cookieParser = require('cookie-parser')
router.use(cookieParser())


// [GET] /login/
router.get('/login', siteController.login)

// [GET] /register/
router.use('/register', siteController.register)

// [GET] /authonize/
router.use('/authonize', siteController.authonize)

// [POST] /validation
router.post('/login', siteController.validation)

// [POST] /store
router.post('/store', siteController.store)

// [GET] /error/:slug
router.use('/:slug', siteController.error)

// Index
router.use('/', isLoggined, siteController.index)


module.exports = router;