/**
 * Centralized Enterprise Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('[API Error]', {
    method: req.method,
    path: req.originalUrl,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(err.details ? { details: err.details } : {})
  });
}
