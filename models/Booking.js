import pool from '../config/database.js';

class Booking {
  // Create booking
  static async createBooking(customerId, carId, startDate, endDate, totalPrice) {
    try {
      const query = `
        INSERT INTO bookings (customer_id, car_id, start_date, end_date, total_price, booking_status)
        VALUES (?, ?, ?, ?, ?, 'pending')
      `;
      
      const [result] = await pool.execute(query, [customerId, carId, startDate, endDate, totalPrice]);
      
      return {
        success: true,
        bookingId: result.insertId,
        message: 'Booking created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Booking failed'
      };
    }
  }

  // Get booking by ID
  static async getBookingById(bookingId) {
    try {
      const query = `
        SELECT b.*, c.brand, c.model, c.daily_price, u.name, u.email
        FROM bookings b
        JOIN cars c ON b.car_id = c.car_id
        JOIN users u ON b.customer_id = u.user_id
        WHERE b.booking_id = ?
      `;
      
      const [rows] = await pool.execute(query, [bookingId]);
      
      return rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  // Get customer's bookings
  static async getCustomerBookings(customerId) {
    try {
      const query = `
        SELECT b.*, c.brand, c.model, c.daily_price
        FROM bookings b
        JOIN cars c ON b.car_id = c.car_id
        WHERE b.customer_id = ?
        ORDER BY b.created_at DESC
      `;
      
      const [rows] = await pool.execute(query, [customerId]);
      
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // Get all bookings (Admin)
  static async getAllBookings() {
    try {
      const query = `
        SELECT b.*, c.brand, c.model, u.name, u.email
        FROM bookings b
        JOIN cars c ON b.car_id = c.car_id
        JOIN users u ON b.customer_id = u.user_id
        ORDER BY b.created_at DESC
      `;
      
      const [rows] = await pool.execute(query);
      
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // Update booking status (Admin)
  static async updateBookingStatus(bookingId, status) {
    try {
      const query = 'UPDATE bookings SET booking_status = ? WHERE booking_id = ?';
      const [result] = await pool.execute(query, [status, bookingId]);
      
      return {
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Booking updated' : 'Booking not found'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Update failed'
      };
    }
  }

  // Cancel booking
  static async cancelBooking(bookingId, customerId) {
    try {
      const query = 'UPDATE bookings SET booking_status = "cancelled" WHERE booking_id = ? AND customer_id = ?';
      const [result] = await pool.execute(query, [bookingId, customerId]);
      
      return {
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Booking cancelled' : 'Booking not found'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Cancellation failed'
      };
    }
  }
}

export default Booking;