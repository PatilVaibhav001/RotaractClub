const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).populate('author', 'name email club').sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { name, category, date, location, description, volunteers, beneficiaries, photos } = req.body;
    
    if (!name || !description || !category || !date || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const event = await Event.create({
      name,
      category,
      date,
      location,
      description,
      volunteers,
      beneficiaries,
      photos: Array.isArray(photos) ? photos : [],
      author: req.user._id
    });

    const populatedEvent = await Event.findById(event._id).populate('author', 'name email club');

    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error creating event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('author', 'name email club');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error fetching event' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { name, category, date, location, description, volunteers, beneficiaries, photos } = req.body;
    
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.name = name || event.name;
    event.category = category || event.category;
    event.date = date || event.date;
    event.location = location || event.location;
    event.description = description || event.description;
    event.volunteers = volunteers !== undefined ? volunteers : event.volunteers;
    event.beneficiaries = beneficiaries !== undefined ? beneficiaries : event.beneficiaries;
    event.photos = Array.isArray(photos) ? photos : event.photos;

    await event.save();
    
    const updatedEvent = await Event.findById(event._id).populate('author', 'name email club');
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server error updating event' });
  }
};

module.exports = { getEvents, createEvent, deleteEvent, getEventById, updateEvent };
