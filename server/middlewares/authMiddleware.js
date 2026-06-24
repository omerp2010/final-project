const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Grab the token from the request header
  const token = req.header('Authorization');

  // 2. If there is no token, deny access
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 3. Verify the token using your secret key
    // (We remove the word 'Bearer ' which Postman automatically adds)
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

    // 4. Attach the user's ID to the request so the Book API knows who they are
    req.user = decoded.userId;
    
    // Pass the request to the next step
    next(); 
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};