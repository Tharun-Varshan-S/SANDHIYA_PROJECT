const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/events', require('./src/routes/events'));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

(async () => {
	try {
		const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventsphere';
		if (mongoUri === 'memory') {
			const { MongoMemoryServer } = require('mongodb-memory-server');
			const mem = await MongoMemoryServer.create();
			const uri = mem.getUri('eventsphere');
			await mongoose.connect(uri);
			console.log('MongoDB (memory) connected');
		} else {
			await mongoose.connect(mongoUri);
			console.log('MongoDB connected');
		}
		app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
	} catch (err) {
		console.error('MongoDB connection error:', err.message);
	}
})();
