const express = require('express');
const router = express.Router();

const siteController = require('../Controllers/SiteController');

// [GET] /login/
router.use('/login', siteController.login)

// [POST] /store
// router.post('/store', siteController.store)

// [GET] /error/:slug
router.use('/:slug', siteController.error)

// Index
router.use('/', siteController.index)


module.exports = router;