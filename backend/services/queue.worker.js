const { Worker } = require("bullmq")
const { redisConnection } = require("./queue.service")
const sendEmail = require("./emailOTPService")

let emailWorker

const initWorkers = () => {
  if (!process.env.REDIS_URI) {
    console.warn("REDIS_URI is missing. Background workers will not start.")
    return
  }

  emailWorker = new Worker(
    "emailQueue",
    async (job) => {
      console.log(`Processing email job ${job.id} for ${job.data.to}`)

      try {
        await sendEmail(job.data)
        console.log(`Email job ${job.id} completed successfully`)
      } catch (error) {
        console.error(`Email job ${job.id} failed:`, error)
        throw error
      }
    },
    { connection: redisConnection },
  )

  emailWorker.on("failed", (job, err) => {
    console.error(`Job ${job.id} has failed with ${err.message}`)
  })
}

module.exports = { initWorkers }
