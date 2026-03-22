# ecom.me — Premium E-Commerce Platform

> **Project Vision**: A high-fidelity, scalable eCommerce marketplace built to showcase advanced web development concepts, fluid micro-interactions, and complex backend architecture.

![E-Commerce Banners](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80)

## 🚀 Key Features to Explore (Demo Highlights)

### 1. The "Neural Hesitation Engine" (Dynamic Discounts)
Navigate to any Product Detail page and simply **wait for 5-8 seconds without clicking "Add to Cart"**. 
* **What happens**: The system detects user hesitation and dynamically generates a live "Claim 10% Off" discount modal powered by Framer Motion, complete with a ticking countdown timer. 
* **Backend Integration**: This isn't just a visual trick; claiming the discount securely saves the `HESITATE10` promo code to `sessionStorage` and mathematically recalculates the final Stripe Checkout session payload.

### 2. Deals of the Day (Live Expiry Engine)
* **What happens**: The homepage features a "Deals of the Day" section. Products marked as active deals by the Admin/Seller have a globally synchronized countdown timer ticking down to the exact millisecond.
* **How to trigger**: Log in as a Seller, go to "Add Product", check **Enable deal pricing**, and set an expiration date. Your product will instantly appear in the glowing Deals slider!

### 3. Stripe Payment Gateway Integration
* True financial integration with **Stripe Checkout**. 
* The backend strictly self-derives and validates 18% GST (Taxes) and Shipping rules ($5000+ free shipping) server-side to prevent client-side cart tampering, ensuring the amount pushed to Stripe is perfectly accurate.

### 4. Admin & Seller Dashboards
* **Role-Based Access Control**: Securely segregated workflows for `user`, `seller`, and `admin`.
* **Sellers**: Can add products with a "Quality Check" score algorithm assessing their listing strength.
* **Admins**: Have access to a master control suite with analytics to monitor global users, verify seller applications, and track revenue.

---

## ⚡ Architectural Strengths

### 1. MongoDB Facet Aggregations
Unlike traditional eCommerce stores that calculate counts on the frontend, ecom.me utilizes the backend `$facet` pipeline to return:
- **Product Results**: Filtered and sorted efficiently (by Price, Rating, Category).
- **Real-time Metrics**: Dynamic category/brand facet counts (e.g., *Electronics (42)*).

### 2. Premium UX & Framer Motion
- **Aesthetic**: Minimalist white-background, precision-rounded corners (`3xl`), and neo-panel glassmorphism.
- **Interactions**: GSAP-powered mechanical 3D transforms (Flip Clock) and staggered scroll reveals for a "premium-first" feel.
- **Micro-animations**: SVG success animations and notification badges syncing dynamically with the Zustand store.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS v3.4, Zustand (Global State Management), Framer Motion + GSAP (Motion/Animations).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas) with Advanced Aggregation Pipelines / Mongoose.
- **Payment Processing**: Stripe API.
- **Utilities**: Nodemailer, Lucide React, Recharts, Canvas-Confetti.

---

## 📦 Getting Started (Local Development)

1. **Setup Backend**:
   ```bash
   cd server
   npm install
   
   # Create a .env file with the following variables:
   # MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY, CLIENT_URL, EMAIL_USER, EMAIL_PASS
   
   # Seed the database with sample products and users
   npm run seed
   
   # Start the Express server
   npm run dev
   ```

2. **Setup Frontend**:
   ```bash
   cd client
   npm install
   
   # Create a .env file with:
   # VITE_API_URL=http://localhost:5000/api
   
   # Start the Vite development server
   npm run dev
   ```

---

## 🔑 Seeded Test Accounts

After running `npm run seed` in your `server` directory, these accounts are auto-generated for testing:

- **Admin Account**: `admin@ecomme.local` / `Password@123`
- **Seller Account**: `seller@ecomme.local` / `Password@123`
- **User Account**: `user@ecomme.local` / `Password@123`

---

## 📜 Credits
Developed as an advanced, premium showcase project. Designed and engineered for maximum demonstration impact and responsive scalability.
