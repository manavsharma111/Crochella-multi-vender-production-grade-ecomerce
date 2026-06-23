const { createClient } = require('redis')

const redisClient = createClient({
    url: process.env.REDIS_URI
})

redisClient.on('error', (err) => console.log('Redis Client Error', err))
redisClient.on('connect', () => console.log('Redis Client Connected'))

// Connect to Redis immediately
const connectRedis = async () => {
    try {
        if (!process.env.REDIS_URI) {
            console.warn('REDIS_URI is not defined in .env. Redis caching will be skipped.')
            return
        }
        await redisClient.connect()
    } catch (error) {
        console.error('Failed to connect to Redis:', error.message)
    }
}

connectRedis()

module.exports = redisClient
