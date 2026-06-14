const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      notification.isRead = true;
      const updatedNotification = await notification.save();
      res.json(updatedNotification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error marking notification as read' });
  }
};

const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.status = 'Approved';
      await user.save();
      
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Rotaract Club - Request Approved!',
        html: `
          <h2>Hello ${user.name || 'Member'},</h2>
          <p>Great news! Your request to join the Rotaract Club has been approved by the admin.</p>
          <p>You can now log in to your account and access the platform.</p>
          <br />
          <p>Best Regards,</p>
          <p>Rotaract Club Team</p>
        `
      });

      res.json({ message: 'User approved successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Approve User Error:', error);
    res.status(500).json({ message: 'Server error approving user', error: error.message });
  }
};

const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.status = 'Rejected';
      await user.save();
      
      await sendEmail({
        email: user.email,
        subject: 'Rotaract Club - Request Update',
        html: `
          <h2>Hello ${user.name || 'Member'},</h2>
          <p>We are sorry to inform you that your request to join the Rotaract Club has been declined at this time.</p>
          <p>If you have any questions, please contact the club administrator.</p>
          <br />
          <p>Best Regards,</p>
          <p>Rotaract Club Team</p>
        `
      });

      res.json({ message: 'User rejected successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Reject User Error:', error);
    res.status(500).json({ message: 'Server error rejecting user', error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  approveUser,
  rejectUser
};
