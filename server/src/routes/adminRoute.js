import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';


const router = express.Router();

// Example: Admin-only route
router.get('/dashboard', protect, adminOnly, (req, res) => {
    res.json({ message: "Welcome to the admin dashboard" });
});

export default router;

