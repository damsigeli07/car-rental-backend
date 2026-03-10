import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// PASSWORD HASHING
// ============================================

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

// Compare password with hashed password
export const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

// ============================================
// JWT TOKEN
// ============================================

// Generate JWT token
export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// ============================================
// ERROR HANDLING
// ============================================

export const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message
  });
};

export const sendSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};