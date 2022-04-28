const express = require('express');
const router = express.Router();

const siteController = require('../Controllers/SiteController');

// /product/index - product.hbs
router.use('/', siteController.index)


module.exports = router;