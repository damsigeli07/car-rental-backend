import { verifyToken, sendError } from '../utils/helpers.js';

// Verify JWT token and set user info
export const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return sendError(res, 401, 'No token provided. Please login first');
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return sendError(res, 401, 'Invalid or expired token. Please login again');
    }

    // Set user info in request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return sendError(res, 500, 'Internal server error');
  }
};

// Check if user is admin
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return sendError(res, 403, 'Admin access required');
  }
  next();
};

// Check if user is customer
export const requireCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return sendError(res, 403, 'Customer access required');
  }
  next();
};