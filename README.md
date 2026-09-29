# Evolis Reality Group — Property Management & Mortgage Portal

A modern, full-stack web application designed for real estate listings, institutional property assets, and mortgage/loan advisory services. Built using a decoupled architecture with a **React (Vite)** frontend and an **ASP.NET Core 8 Web API** backend connected to **Google Cloud Firestore**.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React (Vite)** | SPA with React Router, React Helmet Async, and Context API |
| **Frontend Hosting** | **Firebase Hosting** | Global CDN distribution for static assets |
| **Backend** | **.NET 8 Web API** | RESTful API built with C#, ASP.NET Core, and API Versioning |
| **Backend Hosting** | **Google Cloud Run** | Containerized microservice execution via Docker |
| **Database** | **Google Cloud Firestore** | NoSQL document store for properties, contents, and staff |
| **Authentication** | **JWT & Firebase Auth** | Secure stateless token authentication & role authorization |
| **CI/CD** | **GitHub Actions / Cloud Build** | Automated container builds and deployment pipelines |

---

## 🏗️ Architecture & Security Highlights

### Backend (`house-proj.Server`)
* **Layered Repository Pattern:** Decoupled data layer using `FirestoreDbBuilder` with repository interfaces (`IPropertyRepository`, `IEmployeeRepository`, `IContentRepository`).
* **Security & Middleware Pipeline:**
  * **`BotShieldMiddleware` & `IpRateLimitingMiddleware`:** Protection against automated scraping, spamming, and DoS attacks.
  * **Security Headers:** Strict HTTP response headers including `X-Content-Type-Options`, `X-Frame-Options: DENY`, `X-XSS-Protection`, and environment-aware `Content-Security-Policy` (CSP).
  * **JWT Bearer Authentication:** Built-in token validation with enforced 256-bit secret key standards.
  * **API Versioning:** Structured endpoint lifecycle management using `Asp.Versioning`.
* **Services:** Google reCAPTCHA v2 validation, Gmail SMTP integration for inquiry notifications, and in-memory caching.

### Frontend (`house-proj.client`)
* **Session Bridge Initialization:** Proactive API handshake upon mounting to establish secure sessions.
* **Protected Routes:** Context-based auth wrappers (`AuthProvider`, `ProtectedRoute`) restricting access to admin dashboards and CRUD operations.
* **SEO & Meta Tag Injection:** Dynamic header and meta configuration using `PageMeta` and `React Helmet Async`.

---

## 📁 Repository Structure

```text
evolis-reality-group/
├── house-proj.Server/              # ASP.NET Core 8 Web API
│   ├── Controllers/               # REST Endpoints (Properties, Auth, Loans, etc.)
│   ├── Data/                      # Firestore Context, Repositories, and Services
│   ├── Middleware/                # Security, Bot Shield, Rate Limiting, & CAPTCHA
│   ├── Dockerfile                 # Multi-stage container build for Cloud Run
│   └── Program.cs                 # App entry point, DI container, & pipeline setup
│
├── house-proj.client/              # React (Vite) Frontend
│   ├── public/                    # Static web assets
│   ├── src/
│   │   ├── admin/                 # Protected Admin Dashboards & Auth Hooks
│   │   ├── carousel/              # Property & Employee Featured Carousels
│   │   ├── config/                # API Client Configurations & Meta Handlers
│   │   ├── helpers/               # HTTP Service abstraction (`ApiService`), Custom Hooks
│   │   ├── PropertyPage/          # Public Property Catalog & Detail Views
│   │   └── App.jsx                # Core App Router & Session Bridge Init
│   └── firebase.json              # Firebase Hosting deployment rules
│
└── UnitTest/                       # Unit and integration test suite (.NET)
