const express = require('express');
const router = express.Router();

const adminController = require('../Controllers/AdminController');



// [GET] /admin/:slug - partials/error.hbs
router.use('/:slug', adminController.error)

// /admin/index - admin.hbs
router.use('/', adminController.index)


module.exports = router;