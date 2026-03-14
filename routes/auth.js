import express from 'express';
import AuthController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication needed)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes (authentication required)
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, AuthController.updateProfile);

// Admin routes
router.get('/users', authenticate, AuthController.getAllUsers);

export default router;