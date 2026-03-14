import express from 'express';
import CarController from '../controllers/carController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication needed)
router.get('/', CarController.getAllCars);
router.get('/search', CarController.searchCars);
router.get('/availability', CarController.checkAvailability);
router.get('/:carId', CarController.getCarById);

// Admin routes (authentication + admin check required)
router.post('/', authenticate, CarController.createCar);
router.put('/:carId', authenticate, CarController.updateCar);
router.delete('/:carId', authenticate, CarController.deleteCar);

export default router;