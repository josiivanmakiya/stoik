const User = require('./user.model');

// Create user
async function createUser({ email, fullName, password }) {
  const user = new User({ email, fullName, password });
  await user.save();
  return user.toObject();
}

// Find by email
async function findByEmail(email) {
  return User.findOne({ email });
}

// Find by ID
async function findById(id) {
  return User.findById(id);
}

// Get all users
async function getAllUsers() {
  return User.find();
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  getAllUsers
};
