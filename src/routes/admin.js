const express = require('express');
const router = express.Router();

const adminController = require('../Controllers/AdminController');

// /product/index - product.hbs
router.use('/', adminController.index)


module.exports = router;