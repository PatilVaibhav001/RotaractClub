const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, approveUser } = require('../controllers/notificationController');

router.route('/').get(getNotifications);
router.route('/:id/read').put(markAsRead);
router.route('/users/:id/approve').put(approveUser);

module.exports = router;
