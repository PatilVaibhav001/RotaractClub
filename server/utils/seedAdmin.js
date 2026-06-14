const User = require('../models/User');
const Club = require('../models/Club');

const seedAdmin = async () => {
  try {
    // Seed default clubs
    const defaultClubs = [
      'Rotaract Club Pune Heritage',
      'Rotaract Club of Pune',
      'Rotaract Club of Mumbai',
      'Rotaract Club of Delhi'
    ];
    
    for (const name of defaultClubs) {
      if (!(await Club.findOne({ name }))) {
        await Club.create({ name });
      }
    }
    console.log('Clubs seeded successfully');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rotaract.org';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'Admin',
        status: 'Approved',
        club: 'Rotaract Club Pune Heritage'
      });
      console.log('Main Admin User seeded successfully');
    } else if (adminExists.status !== 'Approved') {
      adminExists.status = 'Approved';
      await adminExists.save();
      console.log('Main Admin User status updated to Approved');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

module.exports = seedAdmin;
