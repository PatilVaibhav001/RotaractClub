const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, approveUser, rejectUser } = require('../controllers/notificationController');

router.route('/').get(getNotifications);
router.route('/:id/read').put(markAsRead);
router.route('/users/:id/approve').put(approveUser);
router.route('/users/:id/reject').put(rejectUser);

module.exports = router;
