const express = require('express');
const router = express.Router();

const shoetypeController = require('../Controllers/ShoetypeController');

// [PUT] /shoetype/:id/update shoetype
router.put('/:id', shoetypeController.update)

// [PATCH] /shoetype/:id/update shoetype
router.patch('/:id/restore', shoetypeController.restore)

// [DELETE] /shoetype/:id/detele shoetype
router.delete('/:id', shoetypeController.delete)
router.delete('/:id/force', shoetypeController.force)

// // [POST] /shoetype/store shoetype
router.post('/store', shoetypeController.store)


module.exports = router;