import jwt from 'jsonwebtoken';

export function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication token missing. Please log in.' });
    }

    const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key';
    const decoded = jwt.verify(token, secret);

    if (decoded.role !== 'admin' || decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid token. Please log in again.' });
  }
}
