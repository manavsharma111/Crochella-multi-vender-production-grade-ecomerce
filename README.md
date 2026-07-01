<div align="center">
  <img src="frontend/public/logo.svg" alt="Crochella Logo" width="200" />

# 🌟 Crochella

### The Next-Generation Multi-Vendor Production Grade E-Commerce Platform

  <p align="center">
    A robust, highly scalable, and beautifully animated full-stack e-commerce architecture. <br/>
    Engineered with React 19, Node.js, MongoDB, Three.js, and Generative AI.
  </p>

  <p align="center">
    <a href="#-core-features">Features</a> •
    <a href="#-comprehensive-feature-modules">Modules</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-environment-variables">Environment Setup</a>
  </p>
</div>

---

## 🚀 Core Features

- **Multi-Vendor Ecosystem**: A complete marketplace allowing multiple sellers/artisans to register, manage inventory, and process orders on a single platform.
- **Immersive 3D UI & Animations**: Integrates `Three.js` and `React Three Fiber` for interactive 3D fabric/product previews, coupled with `GSAP` and `Framer Motion` for buttery smooth cinematic transitions and scroll effects.
- **AI-Powered Intelligence**: Seamlessly integrated with **OpenAI**, **Groq**, and **Google GenAI** to provide smart product recommendations, advanced search, and dynamic content generation.
- **Real-Time Live Tracking & Sockets**: Utilizes `Socket.io` to power live delivery tracking on interactive maps (`Leaflet`), instant notifications, and real-time order status updates.
- **Robust Security & Authentication**: Features traditional JWT authentication alongside seamless OAuth integrations via `Passport.js` (Google, Facebook, Twitter). Protected against NoSQL injections and rate-limited to prevent abuse.
- **Frictionless Payments & Invoicing**: Fully integrated **Razorpay** checkout flows with automated, beautifully formatted PDF invoice generation using `PDFKit`.
- **High-Performance Media Handling**: Direct integration with **Cloudinary** for lightning-fast image delivery, optimization, and secure cloud storage.

---

## 📦 Comprehensive Feature Modules

### 👑 1. Admin Control Panel

The central nervous system of the platform, giving administrators full control:

- **Comprehensive Dashboard**: Real-time sales analytics and graphical representations.
- **User & Vendor Management**: Promote, ban, or assist users and sellers.
- **Product & Order Moderation**: Oversee the entire catalog, manage product approvals, and resolve order disputes.
- **Delivery Staff Management**: Assign, track, and manage the delivery fleet.
- **Coupon & Marketing Engine**: Create complex discount logic, promo codes, and sales campaigns.
- **Review Moderation**: Ensure high-quality user-generated content and ratings.

### 🚚 2. Dedicated Delivery Partner App

A built-in workflow specifically for the delivery fleet:

- **Delivery Dashboard**: View assigned deliveries and optimized routes.
- **Live Tracking System**: Real-time GPS location broadcasting to the end customer.
- **OTP Verification System**: Secure delivery handoffs using dynamic OTP prompts.
- **Return Management**: Handle pickup requests, damaged goods, and reverse logistics seamlessly.

### 🛍️ 3. Advanced Shopping Experience

Built for maximum conversion and user delight:

- **Cinematic Landing Page**: Features artisan stories, handloom history timelines, and horizontal lookbooks.
- **Dynamic Product Pages**: Includes deep-zoom galleries, interactive product accordions, and rich reviews.
- **Smart Cart & Checkout**: Live coupon validation, multi-address management, and frictionless Razorpay payment gateways.
- **Personalized Wishlists**: Custom collections and saved items for future purchases.

### 👤 4. Comprehensive User Profiles

- **Order History & Tracking**: Detailed breakdown of past purchases with live tracking links for active orders.
- **Return & Refund Portal**: Automated workflows to request returns with reason selection.
- **Address Book & Security**: Manage multiple shipping addresses and update authentication credentials.
- **Notification Hub**: A centralized inbox for order updates, promotional messages, and system alerts.

---

## 💻 Tech Stack Overview

### 🎨 Frontend Architecture

- **Framework:** React 19, Vite, React Router v7
- **Styling:** Tailwind CSS v4, Lucide React, clsx, tailwind-merge
- **State Management:** Redux Toolkit, Zustand
- **Animations & 3D:** Three.js, React Three Fiber/Drei, GSAP, Framer Motion, Lenis (Smooth Scrolling)
- **Maps & Location:** Leaflet, React Leaflet
- **PWA Ready:** Configured via `vite-plugin-pwa` for offline capabilities and app-like feel.

### ⚙️ Backend Architecture

- **Core Environment:** Node.js, Express.js (v5)
- **Database:** MongoDB with Mongoose ODM
- **Caching & Message Broker:** Redis (Upstash) for API Caching and distributed Rate Limiting
- **Background Jobs:** BullMQ for asynchronous task processing (e.g., Email Queues)
- **Authentication:** Passport.js (Google, Facebook, Twitter OAuth), JWT (with Redis Blacklisting for secure logouts), bcrypt
- **Real-Time Engine:** Socket.io (with Redis Adapter for horizontal scaling)
- **Payment Gateway:** Razorpay SDK
- **AI Integrations:** `@google/genai`, `openai`, `groq-sdk`
- **File Management:** Multer, Cloudinary
- **Utilities:** PDFKit (Invoicing), Nodemailer (Emails via Queue), Web-Push (Browser Notifications)

---

## 🛠 Getting Started

### Prerequisites

Ensure your development environment meets the following requirements:

- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance or MongoDB Atlas cluster)
- **Git**

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

## 🔑 Environment Variables Setup

You must configure the `.env` files before running the application.

### Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
MONGO_URI=your_mongodb_connection_string

# Security, Auth & Caching
JWT_SECRET=your_super_secret_jwt_key
REDIS_URI=rediss://default:your_token@your_upstash_domain:6379
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
TWITTER_CONSUMER_KEY=your_twitter_consumer_key
TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret

# Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Media Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI APIs
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

### Frontend (`frontend/.env`)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
# Add any Vite-specific public keys for external APIs here
```

---

## ⚡ Running the Application

1. **Launch the Backend Server:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Launch the Frontend Development Server:**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Platform:**
   Open your browser and navigate to `http://localhost:5173`.

---

<div align="center">
  <br />
  <i>Architected with precision for the modern web.</i>
</div>
