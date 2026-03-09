import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
    res.json({
        message: 'Backend is running!',
        status: 'OK',
        timestamp: new Date()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    // Root route
    app.get('/', (req, res) => {
        res.json({
            message: 'Car Rental Backend API',
            version: '1.0.0',
            health: '/api/health'
        });
    });

    // Health check route
    app.get('/api/health', (req, res) => {
        res.json({
            message: 'Backend is running!',
            status: 'OK',
            timestamp: new Date()
        });
    });
    console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
});

export default app;