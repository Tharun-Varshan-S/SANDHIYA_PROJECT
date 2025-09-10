const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ')
		? authHeader.replace('Bearer ', '')
		: null;
	if (!token) return res.status(401).json({ message: 'No token provided' });
	try {
		const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
		const decoded = jwt.verify(token, secret);
		req.userId = decoded.id;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
};
