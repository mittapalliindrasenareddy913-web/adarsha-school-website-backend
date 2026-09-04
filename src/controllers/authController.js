import jwt from 'jsonwebtoken';
import ActivityLog from '../models/ActivityLog.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@adarshaemschool.edu.in';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePassword2026!';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    // Sign JWT token
    const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key';
    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      secret,
      { expiresIn: '7d' }
    );

    // Set HttpOnly Cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Log Activity
    await ActivityLog.create({
      action: 'Admin Login',
      entity: 'Auth',
      adminIdentifier: adminEmail,
      ip: req.ip || req.headers['x-forwarded-for'] || ''
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      user: { email: adminEmail, role: 'admin' }
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const adminEmail = req.admin?.email || process.env.ADMIN_EMAIL;
    
    // Clear HttpOnly Cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
    });

    if (adminEmail) {
      await ActivityLog.create({
        action: 'Admin Logout',
        entity: 'Auth',
        adminIdentifier: adminEmail
      });
    }

    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res) {
  return res.json({
    success: true,
    user: {
      email: req.admin.email,
      role: 'admin'
    }
  });
}
