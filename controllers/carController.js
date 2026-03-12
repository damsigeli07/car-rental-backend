import Car from '../models/Car.js';
import { sendError, sendSuccess } from '../utils/helpers.js';

class CarController {
  // Get all available cars
  static async getAllCars(req, res) {
    try {
      const cars = await Car.getAllCars();
      return sendSuccess(res, 200, 'Cars retrieved', cars);
    } catch (error) {
      console.error('Get cars error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Get car by ID
  static async getCarById(req, res) {
    try {
      const { carId } = req.params;

      const car = await Car.getCarById(carId);
      if (!car) {
        return sendError(res, 404, 'Car not found');
      }

      return sendSuccess(res, 200, 'Car retrieved', car);
    } catch (error) {
      console.error('Get car error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Search/Filter cars
  static async searchCars(req, res) {
    try {
      const { brand, fuelType, minPrice, maxPrice } = req.query;

      const cars = await Car.searchCars(brand, fuelType, minPrice, maxPrice);
      return sendSuccess(res, 200, 'Search results', cars);
    } catch (error) {
      console.error('Search cars error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Create car (Admin only)
  static async createCar(req, res) {
    try {
      // Check if admin
      if (req.user.role !== 'admin') {
        return sendError(res, 403, 'Only admins can create cars');
      }

      const { brand, model, year, fuelType, seatingCapacity, dailyPrice, description } = req.body;

      // Validation
      if (!brand || !model || !dailyPrice) {
        return sendError(res, 400, 'Brand, model, and daily price are required');
      }

      const result = await Car.createCar(brand, model, year, fuelType, seatingCapacity, dailyPrice, description);

      if (result.success) {
        return sendSuccess(res, 201, 'Car added successfully', {
          carId: result.carId
        });
      } else {
        return sendError(res, 400, result.message);
      }
    } catch (error) {
      console.error('Create car error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Update car (Admin only)
  static async updateCar(req, res) {
    try {
      // Check if admin
      if (req.user.role !== 'admin') {
        return sendError(res, 403, 'Only admins can update cars');
      }

      const { carId } = req.params;
      const { dailyPrice, status, description } = req.body;

      if (!dailyPrice && !status && !description) {
        return sendError(res, 400, 'Provide at least one field to update');
      }

      const result = await Car.updateCar(carId, dailyPrice, status, description);

      if (result.success) {
        return sendSuccess(res, 200, result.message);
      } else {
        return sendError(res, 404, result.message);
      }
    } catch (error) {
      console.error('Update car error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Delete car (Admin only)
  static async deleteCar(req, res) {
    try {
      // Check if admin
      if (req.user.role !== 'admin') {
        return sendError(res, 403, 'Only admins can delete cars');
      }

      const { carId } = req.params;

      const result = await Car.deleteCar(carId);

      if (result.success) {
        return sendSuccess(res, 200, result.message);
      } else {
        return sendError(res, 404, result.message);
      }
    } catch (error) {
      console.error('Delete car error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }

  // Check car availability
  static async checkAvailability(req, res) {
    try {
      const { carId, startDate, endDate } = req.query;

      if (!carId || !startDate || !endDate) {
        return sendError(res, 400, 'Car ID, start date, and end date are required');
      }

      const isAvailable = await Car.isAvailable(carId, startDate, endDate);

      return sendSuccess(res, 200, 'Availability checked', {
        carId,
        startDate,
        endDate,
        isAvailable
      });
    } catch (error) {
      console.error('Check availability error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  }
}

export default CarController;