const { createClient } = require("redis")

let redisClient = null
let connectPromise = null

/**
 * Lazy Redis singleton — safe for Vercel serverless.
 * Creates and connects the client only on first call.
 */
const getRedisClient = async () => {
  if (!process.env.REDIS_URI) {
    console.warn("REDIS_URI is not defined. Redis will be skipped.")
    return null
  }

  if (redisClient && redisClient.isReady) {
    return redisClient
  }

  if (!connectPromise) {
    redisClient = createClient({ url: process.env.REDIS_URI })

    redisClient.on("error", (err) => console.error("Redis Client Error:", err.message))
    redisClient.on("connect", () => console.log("Redis Client Connected"))

    connectPromise = redisClient.connect().catch((err) => {
      console.error("Failed to connect to Redis:", err.message)
      redisClient = null
      connectPromise = null
      return null
    })
  }

  await connectPromise
  return redisClient
}

/**
 * Synchronous getter — returns client only if already connected.
 * Used by rate-limit-redis sendCommand.
 */
const getRedisClientSync = () => redisClient

module.exports = { getRedisClient, getRedisClientSync }
