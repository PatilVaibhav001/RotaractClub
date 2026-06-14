const express = require('express');
const router = express.Router();
const { getClubs, createClub } = require('../controllers/clubController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getClubs).post(protect, createClub);

module.exports = router;
