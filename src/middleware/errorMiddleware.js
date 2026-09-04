export function errorHandler(err, req, res, next) {
  console.error('[API Error]', err.stack || err.message || err);

  const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;
  const isProduction = process.env.NODE_ENV === 'production';
  
  const clientMessage = isProduction && statusCode === 500
    ? 'An unexpected server error occurred.'
    : (err.message || 'Internal Server Error');

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
    ...(!isProduction && { stack: err.stack })
  });
}

export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}
