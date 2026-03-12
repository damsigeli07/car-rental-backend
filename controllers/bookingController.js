import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import { sendError, sendSuccess } from '../utils/helpers.js';

class BookingController {
  // Create booking
  static async createBooking(req, res) {
    try {
      const customerId = req.user.userId;
      const { carId, startDate, endDate } = req.body;

      // Validation
      if (!carId || !startDate || !endDate) {
        return sendError(res, 400, 'Car ID, start date, and end date are required');
      }

      // Check if car exists
      const car = await Car.getCarById(carId);
      if (!car) {
        return sendError(res, 404, 'Car not found');
      }

      // Check availability
      const isAvailable = await Car.isAvailable(carId, startDate, endDate);
      if (!isAvailable) {
        return sendError(res, 400, 'Car is not available for selected dates');
      }

      // Calculate total price
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const totalPrice = days * car.daily_price;

      // Create booking
      const result = await Booking.createBooking(customerId, carId, startDate, endDate, totalPrice);

      if (result.success) {
        return sendSuccess(res, 201, 'Booking created successfully', {
          bookingId: result.bookingId,
          totalPrice,
          days
        });
      } else {
        return sendError(res, 400, result.message);
      }
    } catch (error) {
      console.error('Create booking error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Get booking details
  static async getBookingById(req, res) {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.getBookingById(bookingId);
      if (!booking) {
        return sendError(res, 404, 'Booking not found');
      }

      return sendSuccess(res, 200, 'Booking retrieved', booking);
    } catch (error) {
      console.error('Get booking error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Get customer's bookings
  static async getMyBookings(req, res) {
    try {
      const customerId = req.user.userId;

      const bookings = await Booking.getCustomerBookings(customerId);
      return sendSuccess(res, 200, 'Bookings retrieved', bookings);
    } catch (error) {
      console.error('Get bookings error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Get all bookings (Admin only)
  static async getAllBookings(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return sendError(res, 403, 'Only admins can access this');
      }

      const bookings = await Booking.getAllBookings();
      return sendSuccess(res, 200, 'All bookings retrieved', bookings);
    } catch (error) {
      console.error('Get all bookings error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Update booking status (Admin only)
  static async updateBookingStatus(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return sendError(res, 403, 'Only admins can update bookings');
      }

      const { bookingId } = req.params;
      const { status } = req.body;

      if (!status) {
        return sendError(res, 400, 'Status is required');
      }

      const result = await Booking.updateBookingStatus(bookingId, status);

      if (result.success) {
        return sendSuccess(res, 200, result.message);
      } else {
        return sendError(res, 404, result.message);
      }
    } catch (error) {
      console.error('Update booking error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Cancel booking
  static async cancelBooking(req, res) {
    try {
      const customerId = req.user.userId;
      const { bookingId } = req.params;

      const result = await Booking.cancelBooking(bookingId, customerId);

      if (result.success) {
        return sendSuccess(res, 200, result.message);
      } else {
        return sendError(res, 404, result.message);
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }
}

export default BookingController;