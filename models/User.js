import pool from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/helpers.js';

class User {
  // Create a new user (Register)
  static async register(name, email, password, phone) {
    try {
      const hashedPassword = await hashPassword(password);
      
      const query = `
        INSERT INTO users (name, email, password, phone, role)
        VALUES (?, ?, ?, ?, 'customer')
      `;
      
      const [result] = await pool.execute(query, [name, email, hashedPassword, phone]);
      
      return {
        success: true,
        userId: result.insertId,
        message: 'User registered successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await pool.execute(query, [email]);
      
      return rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  // Find user by ID
  static async findById(userId) {
    try {
      const query = 'SELECT user_id, name, email, phone, role, created_at FROM users WHERE user_id = ?';
      const [rows] = await pool.execute(query, [userId]);
      
      return rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await comparePassword(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Get all users (admin only)
  static async getAllUsers() {
    try {
      const query = 'SELECT user_id, name, email, phone, role, created_at FROM users WHERE is_active = TRUE';
      const [rows] = await pool.execute(query);
      
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // Update user profile
  static async updateProfile(userId, name, phone) {
    try {
      const query = 'UPDATE users SET name = ?, phone = ? WHERE user_id = ?';
      const [result] = await pool.execute(query, [name, phone, userId]);
      
      return {
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Profile updated' : 'User not found'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Update failed'
      };
    }
  }
}

export default User;