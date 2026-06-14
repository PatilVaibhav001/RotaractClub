const User = require('../models/User');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Static Admin Authentication
    if (
      email === (process.env.ADMIN_EMAIL || 'admin@rotaract.org') &&
      password === (process.env.ADMIN_PASSWORD || 'admin123')
    ) {
      // Ensure admin exists in DB so we have a valid _id for JWT tokens
      let admin = await User.findOne({ email });
      if (!admin) {
        admin = await User.create({
          name: 'Admin',
          email,
          password,
          role: 'Admin',
          status: 'Approved',
          club: 'System Admin',
          dateOfBirth: '1990-01-01'
        });
      }

      return res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: 'Approved',
        token: generateToken(admin._id),
      });
    }

    // Standard User Authentication
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.status === 'Pending') {
        return res.status(403).json({ message: 'Your account is pending verification by an admin.' });
      }
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth, club } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      if (user.status === 'Rejected') {
        user.name = name;
        user.password = password;
        user.dateOfBirth = dateOfBirth;
        user.club = club;
        user.status = 'Pending';
        await user.save();
      } else {
        return res.status(400).json({ message: 'User already exists' });
      }
    } else {
      user = await User.create({
        name,
        email,
        password,
        dateOfBirth,
        club,
        status: 'Pending'
      });
    }

    if (user) {
      const notification = await Notification.create({
        title: 'New Member Registration',
        message: `${name || email} has requested to join.`,
        userId: user._id
      });

      if (req.io) {
        req.io.emit('newNotification', notification);
      }

      res.status(201).json({
        message: 'Registration successful. Please wait for admin approval.',
        status: 'Pending'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authUser, registerUser };
