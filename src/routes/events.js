const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/events -> list upcoming events
router.get('/', async (req, res) => {
	try {
		const now = new Date();
		const events = await Event.find({ date: { $gte: now } })
			.sort({ date: 1 })
			.populate('organizer', 'name')
			.lean();
		res.json(events);
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
});

// POST /api/events -> create an event (organizer only; any logged-in user acts as organizer here)
router.post('/', auth, async (req, res) => {
	try {
		const { title, description, date } = req.body;
		if (!title || !description || !date) return res.status(400).json({ message: 'All fields required' });
		const event = await Event.create({ title, description, date, organizer: req.userId });
		res.status(201).json(event);
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
});

// POST /api/events/:id/register -> add current user to attendees
router.post('/:id/register', auth, async (req, res) => {
	try {
		const { id } = req.params;
		const event = await Event.findById(id);
		if (!event) return res.status(404).json({ message: 'Event not found' });
		if (!event.attendees.some((a) => String(a) === String(req.userId))) {
			event.attendees.push(req.userId);
			await event.save();
		}
		res.json({ message: 'Registered' });
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
});

// POST /api/events/:id/unregister -> remove current user from attendees
router.post('/:id/unregister', auth, async (req, res) => {
	try {
		const { id } = req.params;
		const event = await Event.findById(id);
		if (!event) return res.status(404).json({ message: 'Event not found' });
		event.attendees = event.attendees.filter((a) => String(a) !== String(req.userId));
		await event.save();
		res.json({ message: 'Unregistered' });
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
