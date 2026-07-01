const { Queue } = require("bullmq")

let redisConnection = {}
if (process.env.REDIS_URI) {
  try {
    const url = new URL(process.env.REDIS_URI)
    redisConnection = {
      host: url.hostname,
      port: url.port ? parseInt(url.port) : 6379,
      password: url.password || url.username,
      tls: url.protocol === "rediss:" ? {} : undefined,
    }
  } catch (error) {
    console.error("Failed to parse REDIS_URI for BullMQ:", error)
  }
}

const emailQueue = new Queue("emailQueue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
})

module.exports = { emailQueue, redisConnection }
