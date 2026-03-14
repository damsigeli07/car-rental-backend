import express from 'express';
import PaymentController from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All payment routes require authentication
router.use(authenticate);

// Customer routes
router.post('/', PaymentController.recordPayment);
router.get('/history', PaymentController.getMyPaymentHistory);
router.get('/:paymentId', PaymentController.getPaymentById);
router.get('/booking/:bookingId', PaymentController.getPaymentByBooking);

// Admin routes
router.get('/', PaymentController.getAllPayments);
router.get('/report/revenue', PaymentController.getRevenueReport);

export default router;