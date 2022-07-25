const express = require('express');
const router = express.Router();

const shoeController = require('../Controllers/ShoeController');

const {isLoggined} = require('../ulti/login')
var cookieParser = require('cookie-parser')
router.use(cookieParser())

// [POST] /shoe/store-custom
router.post('/store-custom', isLoggined, shoeController.storeCustom)

// [POST] /shoe/store-custom
router.get('/custom/list', isLoggined, shoeController.customList)

// [GET] /shoe/custom shoe
router.get('/custom', isLoggined, shoeController.custom)

// [GET] /shoe/delete-cart:id shoe
router.get('/delete-cart', shoeController.deleteCart)

// [GET] /shoe/remove-item:id shoe
router.get('/remove-item/:id', shoeController.removeItem)

// [GET] /shoe/reduce-cart:id shoe
router.get('/reduce-cart/:id', shoeController.reduceCart)

// [GET] /shoe/add-to-cart:id shoe
router.get('/add-to-cart/:id', shoeController.addToCart)

// [GET] /shoe/newarrival shoe
router.get('/newarrival', shoeController.newarrival)

// [GET] /shoe/cheapshoe shoe
router.get('/cheapshoe', shoeController.cheapshoe)

// [GET] /shoe/expensiveshoe shoe
router.get('/expensiveshoe', shoeController.expensiveshoe)

// [GET] /shoe/bestseller shoe
router.get('/bestseller', shoeController.bestseller)

// [GET] /shoe/available shoe
router.get('/available', shoeController.available)

// [GET] /shoe/finding shoe
router.get('/finding', shoeController.finding)

// [GET] /shoe/:id/ shoe
router.get('/:id', shoeController.show)

// [PUT] /shoe/:id/update shoe
router.put('/:id', shoeController.update)

// [PATCH] /shoe/:id/update shoe
router.patch('/:id/restore', shoeController.restore)

// [DELETE] /shoe/:id/detele shoe
router.delete('/:id', shoeController.delete)
router.delete('/:id/force', shoeController.force)

// [POST] /shoe/store shoe
router.post('/store', shoeController.store)

// [GET] /shoe INDEX
router.get('/', shoeController.index)

module.exports = router;