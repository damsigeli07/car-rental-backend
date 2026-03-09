-- Car Rental Management System - Database Setup
-- Created: March 2026

-- Drop database if exists (optional - comment out if you want to keep existing data)
DROP DATABASE IF EXISTS car_rental_db;

-- Create database
CREATE DATABASE car_rental_db;
USE car_rental_db;

-- ============================================
-- USERS TABLE (Customers & Admins)
-- ============================================
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- ============================================
-- CARS TABLE
-- ============================================
CREATE TABLE cars (
  car_id INT AUTO_INCREMENT PRIMARY KEY,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INT,
  fuel_type ENUM('petrol', 'diesel', 'hybrid', 'electric') DEFAULT 'petrol',
  seating_capacity INT DEFAULT 5,
  daily_price DECIMAL(10, 2) NOT NULL,
  status ENUM('available', 'rented', 'maintenance') DEFAULT 'available',
  image_url VARCHAR(255),
  description TEXT,
  added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_brand (brand)
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  car_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  booking_status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (car_id) REFERENCES cars(car_id) ON DELETE CASCADE,
  INDEX idx_customer (customer_id),
  INDEX idx_car (car_id),
  INDEX idx_status (booking_status),
  INDEX idx_dates (start_date, end_date)
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('credit_card', 'debit_card', 'net_banking', 'upi', 'cash') DEFAULT 'credit_card',
  transaction_id VARCHAR(100) UNIQUE,
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  INDEX idx_booking (booking_id),
  INDEX idx_status (payment_status),
  INDEX idx_date (payment_date)
);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample admin user (password: admin123 - bcrypt hashed)
INSERT INTO users (name, email, password, phone, role) 
VALUES (
  'Admin User',
  'admin@carrentals.com',
  '$2a$10$YourHashedPasswordHere',
  '+94771234567',
  'admin'
);

-- Insert sample customer
INSERT INTO users (name, email, password, phone, role) 
VALUES (
  'John Doe',
  'john@example.com',
  '$2a$10$YourHashedPasswordHere',
  '+94771234568',
  'customer'
);

-- Insert sample cars
INSERT INTO cars (brand, model, year, fuel_type, seating_capacity, daily_price, status, description) 
VALUES 
  ('Toyota', 'Corolla', 2023, 'petrol', 5, 5000, 'available', 'Reliable sedan, perfect for daily use'),
  ('Honda', 'City', 2022, 'petrol', 5, 4500, 'available', 'Compact and fuel efficient'),
  ('Hyundai', 'Creta', 2023, 'diesel', 5, 6500, 'available', 'Spacious SUV with good mileage'),
  ('Maruti', 'Swift', 2021, 'petrol', 5, 3500, 'available', 'Budget friendly hatchback'),
  ('Mahindra', 'XUV500', 2023, 'diesel', 7, 8000, 'rented', 'Premium SUV with 7 seats');

-- ============================================
-- DATABASE COMPLETE
-- ============================================
-- All tables created successfully
-- You can now insert more data as needed
-- Use the foreign key constraints to maintain data integrity