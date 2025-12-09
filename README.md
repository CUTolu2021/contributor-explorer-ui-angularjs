# 🐙 Angular Contributor Explorer

## 🌟 Project Overview

This is a modern, full-stack application designed to analyze and display the top contributors across the entire **Angular GitHub organization**.

The project serves as a comprehensive demonstration of professional full-stack development practices, including advanced backend performance optimizations (Batching/Background Sync), secure authentication via OAuth, and readiness for cloud deployment on AWS Fargate/S3.

---

## 🚀 Architecture and Technology Stack

The application is split into two distinct services:

### Frontend (Client)
| Technology | Description |
| :--- | :--- |
| **Angular** | Handles the user interface and reactive state management. |
| **RxJS** | Used extensively for asynchronous data handling, especially during OAuth token validation. |

### Backend (API)
| Technology | Description |
| :--- | :--- |
| **NestJS** | A robust, scalable framework for efficient server-side architecture. |
| **Passport/JWT** | Used for managing secure session tokens after successful OAuth. |
| **GitHub API** | Used to fetch repositories and contributor lists. |

---
## 🔗 Screenshots
Login Page
<img width="1920" height="1080" alt="Screenshot 2025-12-09 225905" src="https://github.com/user-attachments/assets/5465b4d2-9c90-4b29-a7ff-893a2fe6d8d6" />

Dashboard Loading View
<img width="1920" height="1080" alt="Screenshot 2025-12-09 225935" src="https://github.com/user-attachments/assets/fc246d73-244e-4761-8ba2-6dca465c8064" />

Loaded Contributors
<img width="1920" height="1080" alt="Screenshot 2025-12-09 230634" src="https://github.com/user-attachments/assets/b9caca48-8de5-4b5a-b190-9a7573ae2176" />

Sorted Contributors
<img width="1920" height="1080" alt="Screenshot 2025-12-09 230653" src="https://github.com/user-attachments/assets/8ebda2d8-9bb7-42ae-ba83-5e34a6efe8d4" />

Searched Contributors
<img width="1920" height="1080" alt="Screenshot 2025-12-09 230719" src="https://github.com/user-attachments/assets/830bea66-a2cb-45cf-917e-1ee20a558a1d" />

Details of Contributor
<img width="1920" height="1080" alt="Screenshot 2025-12-09 230848" src="https://github.com/user-attachments/assets/c1991863-630a-4844-8814-dfcd97dab30f" />
Details of a selected Repository
<img width="1920" height="1080" alt="Screenshot 2025-12-09 233357" src="https://github.com/user-attachments/assets/9bf2b43f-9c8d-4250-8fb8-a3d95a4c463e" />

Details of Contributor
<img width="1920" height="1080" alt="Screenshot 2025-12-09 233416" src="https://github.com/user-attachments/assets/044a08fe-fb8a-4395-a910-e2eb97ead924" />
Details of a selected Repository
<img width="1920" height="1080" alt="Screenshot 2025-12-09 233425" src="https://github.com/user-attachments/assets/1a3fd868-413d-411b-889e-9d769d28cd70" />



## ✨ Key Technical Features & Decisions

### 1. Advanced Performance Optimization (Batching & UX)

To solve the slow initial load time caused by recursive API calls (fetching 200+ repositories and their contributions), a **Fast Path + Background Fill** caching strategy was implemented:

* **Fast Path:** On a cache miss, the API immediately fetches and processes only the **first page** (top 100) of GitHub repositories and returns this partial data to the user within ~5 seconds.
* **Background Fill:** The full, recursive fetching and aggregation of *all* repositories are then triggered asynchronously in the background.
* **Result:** The user sees data instantly (improved UX), and the cache is silently filled with the full, accurate dataset for subsequent requests (Eventual Consistency).

### 2. Secure Authentication Flow (GitHub OAuth 2.0)

The application implements a secure, industry-standard authentication flow:

* **OAuth Strategy:** Uses the `passport-github` strategy to delegate authentication to GitHub.
* **Token Validation:** Implements a security enhancement on the Angular client: upon receiving the JWT from the backend redirect, the client performs an immediate **`validate-token`** call against a protected NestJS endpoint. This ensures that manually injected or expired tokens are immediately rejected, preventing unauthorized access and maintaining secure state.

### 3. AWS Cloud Readiness

The project is structured with cloud deployment as the goal:

* **Containerization:** The NestJS API includes a production-ready **`Dockerfile`** for quick deployment to container services.
* **Frontend Hosting:** The Angular UI is configured for zero-configuration static file deployment to **S3/CloudFront**, utilizing a global Content Delivery Network (CDN) for maximum speed.

---

## ⚙️ Getting Started

### Prerequisites

* Node.js (v18+)
* Angular CLI
* Docker (Optional, but required for containerization)
* A GitHub OAuth Application (Required for login)

### 1. GitHub Setup

1.  Register a new **OAuth Application** in your GitHub settings.
2.  Set the **Authorization callback URL** to `http://localhost:3000/auth/github/callback`.
3.  Obtain your **Client ID** and **Client Secret**.

### 2. Backend Setup (NestJS API)  https://github.com/CUTolu2021/contributor-explorer-api-nestjs

```bash
# Clone the repository
git clone [YOUR_REPO_URL] contributor-explorer-api

# Navigate to the backend directory
cd contributor-explorer-api

# Install dependencies
npm install

# Create the environment file
cp .env.example .env

# Edit .env and paste your secrets:
# GITHUB_CLIENT_ID=...
# GITHUB_CLIENT_SECRET=...
# GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# Run the API
npm run start:dev
````

### 3\. Frontend Setup (Angular Client)

```bash
# Navigate to the frontend directory
cd ../contributor-explorer-ui

# Install dependencies
npm install

# Check environment.ts and ensure apiUrl points to your backend
# environment.apiUrl = 'http://localhost:3000'

# Run the Angular client
ng serve
```

-----
