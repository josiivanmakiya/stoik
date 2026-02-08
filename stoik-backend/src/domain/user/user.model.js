const User = require('../../db/models/user.model.js');

/**
 * GET USER BY ID
 */
const getUserById = async function(userId) {
  return await User.findById(userId);
};

/**
 * CREATE USER
 */
const createUser = async function(userData) {
  const user = new User(userData);
  return await user.save();
};

/**
 * UPDATE USER
 */
const updateUser = async function(userId, updateData) {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

/**
 * GET ALL USERS
 */
const getAllUsers = async function() {
  return await User.find({});
};

module.exports = {
  getUserById,
  createUser,
  updateUser,
  getAllUsers
};
