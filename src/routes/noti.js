const express = require('express');
const router = express.Router();

const notiController = require('../Controllers/NotificationController');

// [GET] /noti/:id
router.get('/:id', notiController.read)

// // [PUT] /noti/:id/update noti
// router.put('/:id', notiController.update)

// // [PATCH] /noti/:id/update noti
// router.patch('/:id/restore', notiController.restore)

// // [DELETE] /noti/:id/detele noti
// router.delete('/:id', notiController.delete)
// router.delete('/:id/force', notiController.force)

// // // [POST] /noti/store noti
// router.post('/store', notiController.store)


module.exports = router;