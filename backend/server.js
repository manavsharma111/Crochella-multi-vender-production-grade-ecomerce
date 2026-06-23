const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const http = require('http')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const { RedisStore } = require('rate-limit-redis')
const redisClient = require('./config/redis')
const connectDB = require('./config/db.js')
const userRoute = require('./routes/userRoute.js')
const authRoute = require('./routes/authRoute.js')
const uploadRoute = require('./routes/uploadRoute.js')
const productRoute = require('./routes/productRoute.js')
const reviewRoute = require('./routes/reviewRoute.js')
const aiRoute = require('./routes/aiRoute.js')
const wishlistRoute = require('./routes/wishlistRoute.js')
const cartRoute = require('./routes/cartRoute.js')
const paymentRoute = require('./routes/paymentRoute.js')
const orderRoute = require('./routes/orderRoute.js')
const couponRoute = require('./routes/couponRoute.js')
const notificationRoute = require('./routes/notificationRoute.js')
const { startCronJobs } = require('./services/cron.service.js')
const dashboardRoute = require('./routes/dashboardRoute.js')
const deliveryRoute = require('./routes/deliveryRoute.js')
const passport = require('passport')
const { initWorkers } = require('./services/queue.worker.js')

// Initialize Background Workers
initWorkers();

require("./config/passport")

const app = express()
const server = http.createServer(app)

// Initialize Socket.io from service
const { initSocket } = require('./services/socket.service.js')
const io = initSocket(server)

// Inject io into req object 
app.use((req, res, next) => {
    req.io = io;
    next();
});

const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
app.get('/', (req, res) => {
    res.send("yeahhhh......")
})

// data base
connectDB()
// middlewares
app.use(express.json({ limit: '10mb' })) // parse JSON body with increased limit for images
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser()) // parse cookies
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL]
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
})
)
// Global Rate Limiter (Prevent DDoS and Brute Force)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: "Too many requests from this IP, please try again after 15 minutes",
    ...(process.env.REDIS_URI && {
        store: new RedisStore({
            sendCommand: (...args) => redisClient.sendCommand(args),
        }),
    })
})
app.use('/api', limiter)
app.use(passport.initialize())

// cron job
startCronJobs()
//routes
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/upload', uploadRoute)
app.use('/api/products', productRoute)
app.use('/api/reviews', reviewRoute)
app.use('/api/ai', aiRoute)
app.use('/api/wishlist', wishlistRoute)
app.use('/api/cart', cartRoute)
app.use('/api/payment', paymentRoute)
app.use('/api/order', orderRoute)
app.use('/api/coupon', couponRoute)
app.use('/api/notifications', notificationRoute)
app.use('/api/dashboard', dashboardRoute)
app.use('/api/delivery', deliveryRoute)

// Global Error Handler Middleware
const { errorHandler } = require('./middleware/error.handling.middleware.js')
app.use(errorHandler)