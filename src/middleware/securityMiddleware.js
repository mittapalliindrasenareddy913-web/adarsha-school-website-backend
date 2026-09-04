import mongoose from 'mongoose';

/**
 * Middleware to validate MongoDB ObjectId parameter in request URL routes (:id)
 */
export function validateObjectId(req, res, next) {
  if (req.params.id) {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource identifier format.'
      });
    }
  }
  next();
}

/**
 * Middleware to sanitize inputs and prevent NoSQL injection ($ operators)
 */
export function sanitizeInputs(req, res, next) {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
}
