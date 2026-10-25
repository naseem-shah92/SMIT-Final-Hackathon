/**
 * Sliding Window Rate Limiter for AI endpoints (M8 requirement: ~20 requests per user per hour)
 */
const rateLimitMap = new Map();

export function aiRateLimiter(req, res, next) {
  const userId = req.user?.id || req.ip || 'anonymous';
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 20;

  let userRecord = rateLimitMap.get(userId);
  if (!userRecord) {
    userRecord = { timestamps: [] };
    rateLimitMap.set(userId, userRecord);
  }

  // Filter out timestamps older than 1 hour
  userRecord.timestamps = userRecord.timestamps.filter(ts => now - ts < windowMs);

  if (userRecord.timestamps.length >= maxRequests) {
    const oldestTimestamp = userRecord.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return res.status(429).json({
      success: false,
      error: `AI Rate limit exceeded (Maximum 20 requests per hour). Please retry in ${retryAfterSeconds} seconds.`,
      retryAfterSeconds
    });
  }

  userRecord.timestamps.push(now);
  next();
}
