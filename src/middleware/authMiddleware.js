import jwt from 'jsonwebtoken';

export function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication token missing. Please log in.' });
    }

    const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key';
    const decoded = jwt.verify(token, secret);

    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const decodedEmail = (decoded.email || '').trim().toLowerCase();

    const isValidAdmin = decoded.role === 'admin' && (
      decodedEmail === 'adarshatmpl@gmail.com' ||
      decodedEmail === 'admin@adarshaemschool.edu.in' ||
      (adminEmail && decodedEmail === adminEmail)
    );

    if (!isValidAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden: Unauthorized access privileges.' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid token. Please log in again.' });
  }
}
