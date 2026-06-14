const Club = require('../models/Club');

const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find({}).sort({ name: 1 });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching clubs' });
  }
};

const createClub = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Club name is required' });
    
    const clubExists = await Club.findOne({ name });
    if (clubExists) return res.status(400).json({ message: 'Club already exists' });

    const club = await Club.create({ name });
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating club' });
  }
};

module.exports = { getClubs, createClub };
