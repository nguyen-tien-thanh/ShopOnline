const express = require('express');
const router = express.Router();


const brandController = require('../Controllers/BrandController');

// [POST] /brand/handle-form-actions brand
router.post('/handle-form-actions', brandController.handleFormActions)

// [PUT] /brand/:id/update brand
router.put('/:id', brandController.update)

// [PATCH] /brand/:id/update brand
router.patch('/:id/restore', brandController.restore)

// [DELETE] /brand/:id/detele brand
router.delete('/:id', brandController.delete)
router.delete('/:id/force', brandController.force)

// // [POST] /brand/store brand
router.post('/store', brandController.store)


module.exports = router;