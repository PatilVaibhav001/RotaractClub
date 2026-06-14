const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getImageKitAuth, getUsers, makeAdmin } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/imagekit-auth').get(protect, getImageKitAuth);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/').get(protect, getUsers);
router.route('/:id/make-admin').put(protect, makeAdmin);

module.exports = router;
