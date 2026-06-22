const { Server } = require('socket.io')

let io

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", process.env.CLIENT_URL],
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }
    })

    io.on('connection', (socket) => {
        socket.on('joinProductRoom', (productId) => {
            socket.join(`product_${productId}`)
        })

        socket.on('joinOrderTracking', (orderId) => {
            socket.join(`order_${orderId}`)
        })
    })

    return io
}

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized")
    }
    return io
}

module.exports = { initSocket, getIo }
