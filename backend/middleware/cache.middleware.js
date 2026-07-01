const redisClient = require("../config/redis")

const cacheMiddleware = (duration = 3600) => {
  return async (req, res, next) => {
    // Skip caching if Redis is not connected or method is not GET
    if (!redisClient.isOpen || req.method !== "GET") {
      return next()
    }

    // Generate a unique key based on URL and query params
    const key = `cache:${req.originalUrl || req.url}`

    try {
      const cachedData = await redisClient.get(key)

      if (cachedData) {
        // Cache hit
        return res.status(200).json(JSON.parse(cachedData))
      } else {
        // Cache miss - Hijack res.json to save response to Redis before sending
        const originalJson = res.json.bind(res)

        res.json = (body) => {
          // Only cache successful responses
          if (res.statusCode >= 200 && res.statusCode < 300) {
            redisClient
              .setEx(key, duration, JSON.stringify(body))
              .catch((err) => console.error("Redis set error:", err))
          }
          return originalJson(body)
        }

        next()
      }
    } catch (error) {
      console.error("Redis cache middleware error:", error)
      next() // Proceed to DB if Redis fails
    }
  }
}

module.exports = { cacheMiddleware }
