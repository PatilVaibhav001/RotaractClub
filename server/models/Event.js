const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    volunteers: {
      type: Number,
      default: 0,
    },
    beneficiaries: {
      type: Number,
      default: 0,
    },
    photos: {
      type: [String],
      default: [],
    },
    aiReport: {
      type: String,
      default: null,
    },
    aiPoster: {
      type: String,
      default: null,
    },
    socialCaptions: {
      type: Object,
      default: null,
    },
    impactAnalysis: {
      type: Object,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
