# ecom.me — Next-Generation Marketplace Overhaul

> **Project Vision**: Transitioning a basic eCommerce personal project into a high-fidelity, premium marketplace that feels like the 2035 evolution of Amazon and Flipkart.

## 🚀 Architectural Overview

ecom.me is built on a high-performance MERN stack with a focus on immersive visuals and architectural scalability.

### 🎨 Design Philosophy
- **Aesthetic**: Minimalist white-background, precision-rounded corners (`3xl`), and neo-panel glassmorphism.
- **Interactions**: GSAP-powered mechanical 3D transforms (Flip Clock) and staggered scroll reveals for a "premium-first" feel.
- **Micro-animations**: SVG success animations, confetti bursts, and hover-triggered elevation changes.

## ⚡ Key Technical Features

### 1. MongoDB Facet Aggregations
Unlike traditional eCommerce stores that calculate counts on the frontend, ecom.me utilizes the backend `$facet` pipeline to return:
- **Product Results**: Filtered and sorted efficiently.
- **Real-time Metrics**: Dynamic category/brand counts (e.g., *Electronics (42)*).
- **Telemetry**: Dynamic price range detection (Min/Max/Avg) based on current match results.

### 2. Immersive Transactional Flow
- **3-Step Checkout**: Linear progress tracking (Address → Payment → Review).
- **Success Experience**: Custom SVG checkmark animation + `canvas-confetti` celebration.
- **Dynamic Cart**: Real-time free shipping threshold progress bar.

### 3. Administrative Ecosystem
- **Seller Dashboard**: Real-time sales trend charts using `recharts`, quick-action metrics (Revenue, Orders, Conversion).
- **Admin Command Center**: Multi-tab interface for systems metrics and seller application auditing.
- **Nodemailer Integration**: Automated transactional emails triggering on seller status updates (Approval/Rejection).

### 4. Interactive UX Components
- **Mechanical Flip Clock**: Custom GSAP component using `rotateX` 3D transforms for high-urgency deals.
- **Product Image Zoom**: High-density magnification for product details.
- **Notification Badges**: Dynamic cart and account status indicators in the multi-row premium Navbar.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS v3.4, Zustand (State), Framer Motion + GSAP (Motion).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas) with Aggregation Pipelines.
- **Utilities**: Nodemailer, Lucide React, Recharts, Canvas-Confetti.

## 📦 Getting Started

1. **Setup Backend**:
   ```bash
   cd server
   npm install
   # Create .env with MONGO_URI, EMAIL_USER, EMAIL_PASS
   npm run seed
   npm start
   ```

2. **Setup Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🔑 Seeded Test Accounts

After `npm run seed` in `server`, these users are available:

- `admin@ecomme.local` / `Password@123`
- `seller@ecomme.local` / `Password@123`
- `user@ecomme.local` / `Password@123`

## 🧪 API Collection

- Postman collection path: `server/postman/ecomme.postman_collection.json`
- You can import the same JSON into Insomnia as well.

## 📜 Credits
Developed as a premium showcase project for Advanced Web Development.
Designed with ❤️ for a futuristic eCommerce experience.
