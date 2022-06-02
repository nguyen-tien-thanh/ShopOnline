const express = require('express');
const router = express.Router();

const shoeController = require('../Controllers/ShoeController');

const {isLoggined} = require('../ulti/login')
var cookieParser = require('cookie-parser')
router.use(cookieParser())

// [GET] /shoe/:id/ shoe
router.get('/:id', shoeController.show)

// [PUT] /shoe/:id/update shoe
router.put('/:id', shoeController.update)

// [PATCH] /shoe/:id/update shoe
router.patch('/:id/restore', shoeController.restore)

// [DELETE] /shoe/:id/detele shoe
router.delete('/:id', shoeController.delete)
router.delete('/:id/force', shoeController.force)

// // [POST] /shoe/store shoe
router.post('/store', shoeController.store)


module.exports = router;