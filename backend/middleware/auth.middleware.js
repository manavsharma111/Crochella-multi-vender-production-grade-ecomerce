const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

const redisClient = require("../config/redis")

//user
const authMiddleware = async (req, res, next) => {
  try {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1]
    } else if (req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      console.error("JWT_SECRET is missing from environment variables!")
      return res
        .status(500)
        .json({ message: "Internal server error: Configuration missing" })
    }

    // Check if token is blacklisted in Redis
    if (redisClient.isOpen) {
      const isBlacklisted = await redisClient.get(`bl_${token}`)
      if (isBlacklisted) {
        return res
          .status(401)
          .json({ message: "Token has been revoked. Please log in again." })
      }
    }

    const verified = jwt.verify(token, secret)
    req.user = verified
    next()
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" })
    }
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}
//admin
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." })
  }
}
// seller
const sellerMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    next()
  } else {
    return res.status(403).json({ message: "Access denied. Seller only." })
  }
}

// admin or seller
const adminOrSellerMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "seller")) {
    next()
  } else {
    return res
      .status(403)
      .json({ message: "Access denied. Admin or Seller only." })
  }
}
// delivery boy
const deliveryBoyMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "delivery_boy") {
    next()
  } else {
    return res
      .status(403)
      .json({ message: "Access denied. Delivery boy only." })
  }
}

// delivery boy or admin
const deliveryBoyOrAdminMiddleware = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "delivery_boy" || req.user.role === "admin")
  ) {
    next()
  } else {
    return res
      .status(403)
      .json({ message: "Access denied. Delivery boy or Admin only." })
  }
}

module.exports = {
  authMiddleware,
  adminMiddleware,
  sellerMiddleware,
  adminOrSellerMiddleware,
  deliveryBoyMiddleware,
  deliveryBoyOrAdminMiddleware,
}
