const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

exports.authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Extracted Token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    if (!req.userId) {
      return res.status(401).json({ error: 'User ID missing from token' });
    }

    next();
  } catch (error) {
    console.error('Token Verification Error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});












// const jwt = require('jsonwebtoken');

// exports.authenticate = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ message: 'Access Denied' });
// console.log(token);
//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = verified.userId;
//     console.log("Req.userId",req.userId )
//     next();
//   } catch (error) {
//     res.status(400).json({ message: 'Invalid Token' });
//   }
// };
