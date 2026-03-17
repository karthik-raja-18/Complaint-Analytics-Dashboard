# 📊 Civic Complaint Analytics Engine

A high-performance Business Intelligence (BI) dashboard for municipal governance. This platform aggregates civic complaint data from multiple sources (Spring Boot sync & manual CSV uploads) to provide real-time performance tracking and department-wise analytics.

![Hero Preview](https://via.placeholder.com/1200x600?text=Civic+Analytics+Engine+UI)

## 🚀 Features

- **Dynamic Visualization**: Real-time charts for Complaint Volume, Resolution Time, and Success Rates.
- **Department Leaderboard**: Performance-based ranking of municipal zones and departments.
- **Multi-Source Ingestion**:
  - **Spring Boot Sync**: A dedicated API layer for direct integration with existing municipal apps.
  - **Manual Upload**: High-velocity CSV/Excel data ingestion with automated mapping.
- **Premium UI**: Modern "Glassmorphism" design with dark mode, smooth transitions, and staggered animations.
- **Secure Access**: JWT-based authentication for administrative personnel.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Lucide Icons, Recharts, Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt password hashing.

---

## 🏗️ Project Structure

```bash
complaint-analytics/
├── backend/            # Express.js Server
│   ├── models/         # MongoDB Schemas
│   ├── routes/         # API Endpoints (Auth, Sync, Dashboard, Upload)
│   ├── middleware/     # Auth Protection
│   └── server.js       # Entry Point
├── frontend/           # React Client (Vite)
│   ├── src/
│   │   ├── components/ # Dashboard, Charts, Landing, Leaderboard
│   │   ├── context/    # Auth Global State
│   │   └── index.css   # Custom Design System
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local installation.

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```
Start the server:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔄 Workflow & Integration

### External Data Sync
To push data from an external **Spring Boot** application:
- **Endpoint**: `POST /api/sync`
- **Headers**: `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "complaintId": "ISSUE-123",
    "department": "Water Works",
    "status": "RESOLVED",
    "createdAt": "2024-03-10T10:00:00Z",
    "resolvedAt": "2024-03-11T14:00:00Z"
  }
  ```

### Manual Ingestion
Navigate to the **Upload Portal** in the dashboard to import legacy records using the provided CSV template.

## 🎨 Design Philosophy
The system follows a **Premium Dark** aesthetic, utilizing `IntersectionObservers` for scroll-reveal effects and animated mesh gradients to create a breathing, immersive visual depth.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

© 2026 Civic Analytics Engine. Built for Transparent Governance.
