# 🔐 Auth System — Full Stack Authentication App

A production-ready authentication system built with the MERN stack. Features secure JWT-based auth using HTTP-only cookies, real email delivery for password resets, and a fully protected React SPA — deployed on Render.

🌐 **Live Demo:** [https://auth-backend-b6kg.onrender.com](https://auth-backend-b6kg.onrender.com)

---

## ✨ Features

- ✅ User Signup with form validation
- ✅ Secure Login / Logout
- ✅ JWT stored in HTTP-only cookies (XSS protection)
- ✅ Persistent login on page refresh
- ✅ Forgot Password — real email via Resend API
- ✅ Reset Password with secure tokenized link
- ✅ Protected routes (unauthorized users redirected to login)
- ✅ Global auth state via React Context API

---

## 🛠️ Tech Stack

**Frontend**
- React 19 (Vite 7)
- React Router v7
- Axios
- React Toastify

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- cookie-parser
- Resend API (email delivery)

**Deployment**
- Render (backend serves React build — same domain for cookie auth)

---

## 📁 Project Structure

```
authwithreact/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── context/
│   │   │   └── UserContext.jsx   # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Logout.jsx
│   │   │   └── Navbar.jsx
│   │   └── App.jsx              # Routes + loading guard
│   └── vite.config.js
│
└── server/                  # Node.js backend
    ├── Controllers/
    │   ├── AuthController.js     # Signup, Login, Logout, ForgotPassword, ResetPassword
    │   └── ErrorHandlerController.js
    ├── Middlewares/
    │   └── middleware.js         # JWT verification
    ├── Model/
    │   └── UserModel.js
    ├── Routes/
    │   └── AuthRoutes.js
    ├── util/
    │   ├── SecretToken.js        # JWT generator
    │   ├── sendEmail.js          # Resend API integration
    │   └── CustomError.js
    └── index.js                 # Express server entry point
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/signup` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| POST | `/api/v1/auth/logout` | Logout user | Yes |
| GET | `/api/v1/auth/me` | Get current user | Yes |
| POST | `/api/v1/auth/forgot-password` | Send reset email | No |
| POST | `/api/v1/auth/reset-password/:token` | Reset password | No |

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGO_URL=mongodb_atlas_connection_string
TOKEN_KEY=jwt_secret_key
NODE_ENV=production
CLIENT_URL=https://your-domain.onrender.com
RESEND_API_KEY=resend_api_key
PORT=4000
```

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/anshika-234/auth-app.git
cd auth-app

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Run backend (from server/)
cd ../server
npm run dev

# Run frontend (from client/)
cd ../client
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:4000`

---

## 🔒 Security Highlights

- Passwords hashed with **bcryptjs** before storing
- JWT stored in **HTTP-only cookies** — not accessible via JavaScript (prevents XSS)
- `sameSite` cookie flag set dynamically based on environment
- Password reset tokens are **hashed (SHA-256)** before storing in DB
- Reset tokens expire after **10 minutes**
- Protected routes redirect unauthenticated users to login

---

## 🐛 Real Bugs Fixed in Production

This project involved solving several real-world production issues:

- **SMTP blocked on Render** — Render's free tier blocks outbound SMTP ports. Switched to Resend HTTP API for reliable email delivery.
- **Cross-origin cookie issue** — `sameSite: "lax"` cookies don't send on cross-origin requests. Solved by serving React build from the backend (same domain).
- **SPA routing on refresh** — Added `app.use()` fallback to serve `index.html` for all non-API routes.
- **Express 5 wildcard syntax** — `app.get("*")` deprecated in Express 5; migrated to `app.use()` fallback.

---

## 👩‍💻 Author

**Anshika Gupta**  
Self-taught MERN Stack Developer  
📍 Agra, Uttar Pradesh  
🔗 [GitHub](https://github.com/anshika-234) | [LinkedIn](https://www.linkedin.com/in/anshika-gupta-1495192a5)
