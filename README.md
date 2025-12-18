# 🕵️ Anonymous Feedback — Get Honest Feedback Without Fear

## 💡 Overview

**Anonymous Feedback** is a full-stack **Next.js application** that allows users to collect **honest and unbiased feedback** without revealing the sender’s identity.

People often hesitate to give real feedback when their name is visible. This platform solves that problem by providing a **unique anonymous feedback link**. Anyone with the link can submit feedback without logging in, while the owner receives all messages securely on their dashboard.

# 🌐 Live Demo
🔗 **Live Application:** https://your-live-app-link.vercel.app

---

## 🔐 Authentication & Security

- Secure user authentication using **NextAuth**
- Password hashing with **bcryptjs**
- JWT-based session handling
- Email verification using **Nodemailer**
- Protected routes using middleware
- Input validation with **Zod**

---

## 🚀 Features

- 🔑 User registration and login
- 📧 Email verification system
- 🔗 Unique shareable feedback link
- 🕵️ Completely anonymous message submission
- 📬 Private dashboard to view feedback
- ⚙️ Option to enable or disable accepting messages
- 🛡️ Secure APIs with schema validation
- 📱 Fully responsive UI
- ⚡ Optimized Next.js App Router architecture

---

## 🛠 Tech Stack

### 🧑‍💻 Frontend
- **Next.js**
- **React**
- **TypeScript**
- **ShadCN UI**
- **Tailwind CSS**
- **Axios**

### 🖥️ Backend
- **Node.js**
- **Next.js API Routes**
- **MongoDB + Mongoose**
- **NextAuth**
- **bcryptjs**
- **Zod**
- **Nodemailer**
- **JWT**

---

## 📁 Folder Structure

```plaintext
src/
├── app/
│   ├── (app)/                # Protected dashboard routes
│   ├── (auth)/               # Authentication pages
│   ├── api/                  # API routes
│   ├── u/                    # Public anonymous feedback pages
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   ├── globals.css           # Global styles
│   └── messages.json         # Static/sample data
│
├── components/
│   ├── ui/                   # ShadCN UI components
│   ├── MessageCard.tsx
│   ├── Navbar.tsx
│   ├── ProfileSkeleton.tsx
│   └── SkeletonCard.tsx
│
├── context/
│   └── AuthProvider.tsx      # Authentication context
│
├── helpers/
│   └── sendVerificationEmail.ts
│
├── lib/
│   ├── dbConnect.ts          # MongoDB connection
│   ├── resend.ts             # Email utilities
│   └── utils.ts
│
├── model/
│   └── User.model.ts         # User schema/model
│
├── schemas/
│   ├── acceptMessageSchema.ts
│   ├── messageSchema.ts
│   ├── signInSchema.ts
│   ├── signUpSchema.ts
│   └── verifySchema.ts
│
├── types/
│   ├── ApiResponse.ts
│   ├── next-auth.d.ts
│   └── nodemailer.d.ts
└── middleware.ts             # Route protection
