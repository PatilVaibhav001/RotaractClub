const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rotaract.org';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'Admin',
      });
      console.log('Main Admin User seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

module.exports = seedAdmin;
