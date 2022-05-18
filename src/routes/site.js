const express = require('express');
const router = express.Router();

const siteController = require('../Controllers/SiteController');

// [GET] /login/
router.use('/login', siteController.login)

// [GET] /register/
router.use('/register', siteController.register)

// [GET] /authonize/
router.use('/authonize', siteController.authonize)

// [POST] /store
router.post('/store', siteController.store)

// [POST] /validation
router.post('/validation', siteController.validation)

// [GET] /error/:slug
router.use('/:slug', siteController.error)

// Index
router.use('/', siteController.index)


module.exports = router;