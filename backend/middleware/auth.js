const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_campus_cash_token';

module.exports = function authMiddleware(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied, token missing!' });

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        req.user = verified; // { userId, role }
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};
