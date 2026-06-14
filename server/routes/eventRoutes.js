const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent, getEventById, updateEvent } = require('../controllers/eventController');
const { generateAiAnalysis, generateAiPoster } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getEvents).post(protect, createEvent);
router.route('/:id').get(protect, getEventById).put(protect, updateEvent).delete(protect, deleteEvent);
router.route('/:id/analyze').post(protect, generateAiAnalysis);
router.route('/:id/poster').post(protect, generateAiPoster);

module.exports = router;
