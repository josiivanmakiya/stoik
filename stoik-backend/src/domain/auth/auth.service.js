const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../db/models/user.model.js');
const { getUserById } = require('../user/user.service.js');

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production' ? null : 'demo-insecure-jwt-secret');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const INVALID_CREDENTIALS_ERROR = 'Invalid email or password';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

/**
 * REGISTER USER
 */
const registerUser = async ({ email, password, fullName, phone, address }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = new User({
    email,
    password: hashedPassword,
    fullName,
    phone: phone || null,
    address: address || null,
    status: 'active'
  });

  const createdUser = await user.save();

  // Generate JWT
  const token = jwt.sign(
    { userId: createdUser._id.toString(), email: createdUser.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Return user without password
  const { password: _, ...userWithoutPassword } = createdUser.toObject();
  return { user: userWithoutPassword, token };
};

/**
 * LOGIN USER
 */
const loginUser = async ({ email, password }) => {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) throw new Error(INVALID_CREDENTIALS_ERROR);

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new Error(INVALID_CREDENTIALS_ERROR);

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const { password: _, ...userWithoutPassword } = user.toObject();
  return { user: userWithoutPassword, token };
};

/**
 * VERIFY JWT TOKEN
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * GET USER FROM TOKEN
 */
const getUserFromToken = async (token) => {
  const decoded = verifyToken(token);
  const user = await getUserById(decoded.userId);
  if (!user) throw new Error('User not found');

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
  getUserFromToken
};
