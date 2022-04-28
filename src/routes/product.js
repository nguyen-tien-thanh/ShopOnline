const express = require('express');
const router = express.Router();

const productController = require('../Controllers/ProductController');

// // [POST] /product/handle-form-actions product
// router.post('/handle-form-actions', productController.handleFormActions)

// // [GET] /product/create product
// router.use('/create', productController.create)

// // [GET] /product/trash product
// router.use('/trash', productController.trash)

// // [GET] /product/create product
// router.use('/manage', productController.manage)

// // [GET] /product/:id/edit product
// router.get('/:id/edit', productController.edit)

// // [PUT] /product/:id/update product
// router.put('/:id', productController.update)

// // [PATCH] /product/:id/update product
// router.patch('/:id/restore', productController.restore)

// // [DELETE] /product/:id/detele product
// router.delete('/:id', productController.delete)
// router.delete('/:id/force', productController.force)

// // // [POST] /product/store product
// router.post('/store', productController.store)

// [link bien dong] /product/show || /product/:slug
router.use('/:slug', productController.show)

// /product/index - product.hbs
router.use('/', productController.index)


module.exports = router;