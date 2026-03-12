import User from '../models/User.js';
import { generateToken, sendError, sendSuccess } from '../utils/helpers.js';

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      // Validation
      if (!name || !email || !password) {
        return sendError(res, 400, 'Name, email, and password are required');
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return sendError(res, 409, 'Email already registered');
      }

      // Register user
      const result = await User.register(name, email, password, phone);

      if (result.success) {
        return sendSuccess(res, 201, 'User registered successfully', {
          userId: result.userId
        });
      } else {
        return sendError(res, 400, result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return sendError(res, 400, 'Email and password are required');
      }

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return sendError(res, 401, 'Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await User.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return sendError(res, 401, 'Invalid email or password');
      }

      // Generate JWT token
      const token = generateToken(user.user_id, user.role);

      return sendSuccess(res, 200, 'Login successful', {
        token,
        user: {
          userId: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Get user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId; // From auth middleware

      const user = await User.findById(userId);
      if (!user) {
        return sendError(res, 404, 'User not found');
      }

      return sendSuccess(res, 200, 'Profile retrieved', user);
    } catch (error) {
      console.error('Get profile error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { name, phone } = req.body;

      if (!name && !phone) {
        return sendError(res, 400, 'Provide at least name or phone to update');
      }

      const result = await User.updateProfile(userId, name, phone);

      if (result.success) {
        return sendSuccess(res, 200, result.message);
      } else {
        return sendError(res, 400, result.message);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Get all users (Admin only)
  static async getAllUsers(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return sendError(res, 403, 'Only admins can access this');
      }

      const users = await User.getAllUsers();
      return sendSuccess(res, 200, 'Users retrieved', users);
    } catch (error) {
      console.error('Get users error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }
}

export default AuthController;