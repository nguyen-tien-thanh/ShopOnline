const express = require('express');
const router = express.Router();

const notificationController = require('../Controllers/NotificationController');

// [GET] /noti/:id
router.post('/read-noti', notificationController.read)

// // [PUT] /noti/:id/update noti
// router.put('/:id', notificationController.update)

// // [PATCH] /noti/:id/update noti
// router.patch('/:id/restore', notificationController.restore)

// // [DELETE] /noti/:id/detele noti
// router.delete('/:id', notificationController.delete)
// router.delete('/:id/force', notificationController.force)

// // // [POST] /noti/store noti
// router.post('/store', notificationController.store)


module.exports = router;