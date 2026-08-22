# இனியா சர்க்கரை — Iniya Sugar

**Pure Sweetness, Straight from Nature**

A complete, modern e-commerce website for a fictional Tamil sugar brand — built with React (frontend) and Node.js/Express/MongoDB/Razorpay (backend).

---

## 📁 Project Structure

```
iniya-sugar-ecommerce/
├── frontend/     React + Vite storefront
├── backend/      Express API + Razorpay + MongoDB
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your own values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/iniya_sugar
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

> Note: If `MONGO_URI` is not set or MongoDB is unreachable, the server will still
> start (useful for frontend development), but orders will not be saved and
> `/api/payment/verify` will fail. Payment order creation also requires valid
> Razorpay test keys.

---

### 2. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the frontend:

```bash
npm run dev
```

The site will run at `http://localhost:5173`.

---

## 🧾 Getting Razorpay Test Keys

1. Sign up at [razorpay.com](https://razorpay.com) and switch to **Test Mode**.
2. Go to **Settings → API Keys** and generate a test Key ID and Key Secret.
3. Put the **Key ID** in both `frontend/.env` and `backend/.env`.
4. Put the **Key Secret** only in `backend/.env` — never expose it in frontend code.
5. Use [Razorpay's test card numbers](https://razorpay.com/docs/payments/payments/test-card-details/) to simulate payments.

---

## 🛠 Tech Stack

**Frontend:** React, Vite, React Router DOM, plain CSS, React Icons, LocalStorage cart persistence.

**Backend:** Node.js, Express.js, MongoDB (Mongoose), Razorpay Orders API with server-side signature verification.

---

## ✅ Features

- Tamil/Indian-inspired responsive design (cream, sugarcane green, dark brown palette)
- Home, About, Products, Cart, Process, and Checkout pages
- Cart with quantity controls, persisted in `localStorage`
- Free delivery over ₹500, otherwise ₹40 delivery
- Checkout form validation (mobile, email, pincode, etc.)
- Secure Razorpay payment flow:
  1. Frontend requests an order from the backend
  2. Backend creates a Razorpay order (amount recalculated server-side from trusted prices)
  3. Razorpay Checkout opens on the frontend
  4. On payment completion, the signature is verified server-side using HMAC SHA256
  5. Order is saved to MongoDB **only after** successful verification
- Toast notifications, loading/success/failure states, empty-cart state
- SEO: page titles, meta description, Open Graph tags, semantic HTML, alt text

---

## 📦 Building for Production

```bash
cd frontend
npm run build
```

This outputs a static build in `frontend/dist`, which can be deployed to any static host (Vercel, Netlify, etc.) alongside the backend deployed separately (Render, Railway, etc.).

---

© 2026 Iniya Sugar. All Rights Reserved.
