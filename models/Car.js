import pool from '../config/database.js';

class Car {
  // Get all cars
  static async getAllCars() {
    try {
      const query = 'SELECT * FROM cars WHERE status != "maintenance" ORDER BY car_id';
      const [rows] = await pool.execute(query);
      
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // Get car by ID
  static async getCarById(carId) {
    try {
      const query = 'SELECT * FROM cars WHERE car_id = ?';
      const [rows] = await pool.execute(query, [carId]);
      
      return rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  // Search/Filter cars
  static async searchCars(brand, fuelType, minPrice, maxPrice) {
    try {
      let query = 'SELECT * FROM cars WHERE status = "available"';
      const params = [];

      if (brand) {
        query += ' AND brand LIKE ?';
        params.push(`%${brand}%`);
      }

      if (fuelType) {
        query += ' AND fuel_type = ?';
        params.push(fuelType);
      }

      if (minPrice) {
        query += ' AND daily_price >= ?';
        params.push(minPrice);
      }

      if (maxPrice) {
        query += ' AND daily_price <= ?';
        params.push(maxPrice);
      }

      const [rows] = await pool.execute(query, params);
      
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // Create car (Admin only)
  static async createCar(brand, model, year, fuelType, seatingCapacity, dailyPrice, description) {
    try {
      const query = `
        INSERT INTO cars (brand, model, year, fuel_type, seating_capacity, daily_price, description, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'available')
      `;
      
      const [result] = await pool.execute(query, [brand, model, year, fuelType, seatingCapacity, dailyPrice, description]);
      
      return {
        success: true,
        carId: result.insertId,
        message: 'Car added successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to add car'
      };
    }
  }

  // Update car (Admin only)
  static async updateCar(carId, dailyPrice, status, description) {
    try {
      const query = `
        UPDATE cars 
        SET daily_price = ?, status = ?, description = ? 
        WHERE car_id = ?
      `;
      
      const [result] = await pool.execute(query, [dailyPrice, status, description, carId]);
      
      return {
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Car updated' : 'Car not found'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Update failed'
      };
    }
  }

  // Delete car (Admin only)
  static async deleteCar(carId) {
    try {
      const query = 'DELETE FROM cars WHERE car_id = ?';
      const [result] = await pool.execute(query, [carId]);
      
      return {
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Car deleted' : 'Car not found'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Delete failed'
      };
    }
  }

  // Check car availability
  static async isAvailable(carId, startDate, endDate) {
    try {
      const query = `
        SELECT COUNT(*) as count FROM bookings 
        WHERE car_id = ? 
        AND booking_status IN ('pending', 'confirmed')
        AND (
          (start_date <= ? AND end_date >= ?)
          OR (start_date <= ? AND end_date >= ?)
          OR (start_date >= ? AND end_date <= ?)
        )
      `;
      
      const [rows] = await pool.execute(query, [carId, startDate, startDate, endDate, endDate, startDate, endDate]);
      
      return rows[0].count === 0;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  }
}

export default Car;