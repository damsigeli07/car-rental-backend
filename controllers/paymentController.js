import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { sendError, sendSuccess } from '../utils/helpers.js';

class PaymentController {
  // Record payment
  static async recordPayment(req, res) {
    try {
      const { bookingId, amount, paymentMethod } = req.body;

      // Validation
      if (!bookingId || !amount || !paymentMethod) {
        return sendError(res, 400, 'Booking ID, amount, and payment method are required');
      }

      // Check if booking exists
      const booking = await Booking.getBookingById(bookingId);
      if (!booking) {
        return sendError(res, 404, 'Booking not found');
      }

      // Verify amount matches
      if (parseFloat(amount) !== parseFloat(booking.total_price)) {
        return sendError(res, 400, `Amount must be ${booking.total_price}`);
      }

      // Record payment
      const result = await Payment.createPayment(bookingId, amount, paymentMethod);

      if (result.success) {
        // Update booking status to confirmed
        await Booking.updateBookingStatus(bookingId, 'confirmed');

        return sendSuccess(res, 201, 'Payment recorded successfully', {
          paymentId: result.paymentId
        });
      } else {
        return sendError(res, 400, result.message);
      }
    } catch (error) {
      console.error('Record payment error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Get payment details
  static async getPaymentById(req, res) {
    try {
      const { paymentId } = req.params;

      const payment = await Payment.getPaymentById(paymentId);
      if (!payment) {
        return sendError(res, 404, 'Payment not found');
      }

      return sendSuccess(res, 200, 'Payment retrieved', payment);
    } catch (error) {
      console.error('Get payment error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Get payment by booking
  static async getPaymentByBooking(req, res) {
    try {
      const { bookingId } = req.params;

      const payment = await Payment.getPaymentByBooking(bookingId);
      if (!payment) {
        return sendError(res, 404, 'No payment found for this booking');
      }

      return sendSuccess(res, 200, 'Payment retrieved', payment);
    } catch (error) {
      console.error('Get payment error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Get customer payment history
  static async getMyPaymentHistory(req, res) {
    try {
      const customerId = req.user.userId;

      const payments = await Payment.getCustomerPaymentHistory(customerId);
      return sendSuccess(res, 200, 'Payment history retrieved', payments);
    } catch (error) {
      console.error('Get payment history error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Get all payments (Admin only)
  static async getAllPayments(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return sendError(res, 403, 'Only admins can access this');
      }

      const payments = await Payment.getAllPayments();
      return sendSuccess(res, 200, 'All payments retrieved', payments);
    } catch (error) {
      console.error('Get all payments error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Get revenue report (Admin only)
  static async getRevenueReport(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return sendError(res, 403, 'Only admins can access this');
      }

      const { startDate, endDate } = req.query;

      const report = await Payment.getRevenueReport(startDate, endDate);
      
      return sendSuccess(res, 200, 'Revenue report', {
        period: {
          startDate: startDate || 'All time',
          endDate: endDate || 'Today'
        },
        data: report
      });
    } catch (error) {
      console.error('Revenue report error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }
}

export default PaymentController;