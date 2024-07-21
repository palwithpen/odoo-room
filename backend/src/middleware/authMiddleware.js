const jwt = require('jsonwebtoken');
const { API_RESPONSE } = require('../utils/common');

const secretKey = 'my-safe-word';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['x-authorization'];
    if (!authHeader) return res.status(401).json(API_RESPONSE(403, "ACCESS_DENIED"));

    let token = authHeader;
    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7, authHeader.length).trim();
    }

    if (!token) return res.status(401).json(API_RESPONSE(403, "ACCESS_DENIED"));

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json(API_RESPONSE(403, "INVALID_TOKEN"));
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
