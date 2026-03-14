import express from 'express';
import BookingController from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

// Customer routes
router.post('/', BookingController.createBooking);
router.get('/my-bookings', BookingController.getMyBookings);
router.get('/:bookingId', BookingController.getBookingById);
router.delete('/:bookingId', BookingController.cancelBooking);

// Admin routes
router.get('/', BookingController.getAllBookings);
router.put('/:bookingId/status', BookingController.updateBookingStatus);

export default router;