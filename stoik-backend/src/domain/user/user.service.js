const userModel = require('./user.model');

module.exports = {
  createUser: userModel.createUser,
  getAllUsers: userModel.getAllUsers,
  getUserById: userModel.getUserById,
};
