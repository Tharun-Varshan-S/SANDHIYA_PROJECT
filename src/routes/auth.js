const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
		const existing = await User.findOne({ email });
		if (existing) return res.status(400).json({ message: 'Email already in use' });
		const user = await User.create({ name, email, password });
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });
		res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: 'Invalid credentials' });
		const ok = await user.comparePassword(password);
		if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });
		res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
