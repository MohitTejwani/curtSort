const jwt = require('jsonwebtoken');
require('dotenv').config();
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized',err });
    }
    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;