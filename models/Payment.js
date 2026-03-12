import pool from '../config/database.js';

class Payment {
  // Create payment
  static async createPayment(bookingId, amount, paymentMethod, transactionId = null) {
    try {
      const query = `
        INSERT INTO payments (booking_id, amount, payment_method, transaction_id, payment_status)
        VALUES (?, ?, ?, ?, 'completed')
      `;
      
      const [result] = await pool.execute(query, [bookingId, amount, paymentMethod, transactionId]);
      
      return {
        success: true,
        paymentId: result.insertId,
        message: 'Payment recorded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Payment failed'
      };
    }
  }

  // Get payment by ID
  static async getPaymentById(paymentId) {
    try {
      const query = 'SELECT * FROM payments WHERE payment_id = ?';
      const [rows] = await pool.execute(query, [paymentId]);
      
      return rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  // Get payment by booking ID
  static async getPaymentByBooking(bookingId) {
    try {
      const query = 'SELECT * FROM payments WHERE booking_id = ?';
      const [rows] = await pool.execute(query, [bookingId]);
      
      return rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  // Get all payments (Admin)
  static async getAllPayments() {
    try {
      const query = `
        SELECT p.*, b.booking_id, u.name
        FROM payments p
        JOIN bookings b ON p.booking_id = b.booking_id
        JOIN users u ON b.customer_id = u.user_id
        ORDER BY p.payment_date DESC
      `;
      
      const [rows] = await pool.execute(query);
      
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // Get payment history for customer
  static async getCustomerPaymentHistory(customerId) {
    try {
      const query = `
        SELECT p.*, b.booking_id, c.brand, c.model
        FROM payments p
        JOIN bookings b ON p.booking_id = b.booking_id
        JOIN cars c ON b.car_id = c.car_id
        WHERE b.customer_id = ?
        ORDER BY p.payment_date DESC
      `;
      
      const [rows] = await pool.execute(query, [customerId]);
      
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // Update payment status
  static async updatePaymentStatus(paymentId, status) {
    try {
      const query = 'UPDATE payments SET payment_status = ? WHERE payment_id = ?';
      const [result] = await pool.execute(query, [status, paymentId]);
      
      return {
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Payment updated' : 'Payment not found'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Update failed'
      };
    }
  }

  // Get revenue report (Admin)
  static async getRevenueReport(startDate = null, endDate = null) {
    try {
      let query = `
        SELECT 
          DATE(payment_date) as date,
          COUNT(*) as transactions,
          SUM(amount) as total_revenue,
          AVG(amount) as avg_amount
        FROM payments
        WHERE payment_status = 'completed'
      `;
      
      const params = [];
      
      if (startDate) {
        query += ' AND payment_date >= ?';
        params.push(startDate);
      }
      
      if (endDate) {
        query += ' AND payment_date <= ?';
        params.push(endDate);
      }
      
      query += ' GROUP BY DATE(payment_date) ORDER BY date DESC';
      
      const [rows] = await pool.execute(query, params);
      
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }
}

export default Payment;