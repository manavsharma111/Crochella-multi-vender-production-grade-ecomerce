<div align="center">
  <img src="https://via.placeholder.com/150" alt="Crochella Logo" width="100" />

  # Crochella - Multi-Vendor Production Grade E-Commerce Platform

  A cutting-edge, highly scalable, and production-ready full-stack e-commerce solution. <br/>
  Powered by React, Node.js, MongoDB, Socket.io, Razorpay, and generative AI.

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#environmental-variables">Environmental Variables</a>
  </p>
</div>

---

## 🚀 Features

- **Multi-Vendor System**: Seamlessly allows multiple sellers to register, manage inventory, and process orders.
- **Interactive 3D Elements**: Integrated Three.js and React Three Fiber to showcase 3D product previews and engaging UI interactions.
- **Real-Time Capabilities**: Leveraging Socket.io for live notifications, live tracking, and real-time order updates.
- **Robust Authentication**: Multi-platform OAuth (Google, Facebook, Twitter) powered by Passport.js along with traditional JWT-based local auth.
- **Seamless Payments**: Fully integrated Razorpay checkout flows for fast and secure transactions.
- **Next-Gen AI Integrations**: Built-in support for OpenAI, Groq, and Google GenAI for personalized product recommendations and smart search.
- **Rich Media Storage**: Integrated with Cloudinary for fast, optimized, and secure image storage.
- **Invoicing & Notifications**: Automatic PDF invoice generation using PDFKit, automated emails via Nodemailer, and Web-Push for browser notifications.
- **Smooth Animations**: High-performance animations and smooth scrolling experiences built with GSAP, Framer Motion, and Lenis.

---

## 💻 Tech Stack

### Frontend
- **Framework & Build:** React 19, Vite, React Router DOM v7
- **Styling & UI:** Tailwind CSS v4, Lucide React, React Icons
- **State Management:** Redux Toolkit, Zustand
- **Animations & 3D:** Three.js, React Three Fiber, GSAP, Framer Motion, Lenis
- **Maps:** Leaflet, React Leaflet

### Backend
- **Core:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** Passport.js (Google, Facebook, Twitter), JSON Web Tokens (JWT), bcryptjs
- **Real-Time & Communication:** Socket.io, Nodemailer, Web-Push
- **Payments:** Razorpay
- **Media & Files:** Cloudinary, Multer, PDFKit
- **Security:** Express Rate Limit, Express Mongo Sanitize, CORS, Helmet
- **AI Integration:** OpenAI SDK, Groq SDK, Google GenAI SDK

---

## 🛠 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/manavsharma111/Crochella-multi-vender-production-grade-ecomerce.git
   cd Crochella-multi-vender-production-grade-ecomerce
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 🔑 Environmental Variables

You will need to set up your `.env` files in both the `frontend` and `backend` directories. 

### Backend (`backend/.env`)
Create a `.env` file in the root of the `backend` folder and add the following keys:
```env
# Server
PORT=5000
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
TWITTER_CONSUMER_KEY=your_twitter_consumer_key
TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI Keys
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

### Frontend (`frontend/.env`)
Create a `.env` file in the root of the `frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

*(Add any other Vite-specific public keys needed for Razorpay, Google Auth, etc. here)*

---

## ⚡ Running the Application

1. **Start the Backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open the Application:**
   Visit `http://localhost:5173` in your browser.

---

<div align="center">
  <i>Developed with ❤️ for the future of e-commerce.</i>
</div>
