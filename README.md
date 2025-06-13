# JourneySync: Travel Planner

JourneySync is a comprehensive web application developed as a university project to streamline travel planning. It offers a centralized platform for users to customize, manage, and visualize their trips with ease. Designed for solo travelers, families, group adventurers, and digital nomads, the app simplifies the journey from trip ideation to final itinerary management.

## 🌍 Project Description

JourneySync combines third-party API data with custom backend services to offer real-time flight, hotel, and weather information, interactive maps, personalized itineraries, and secure bookings — all in one place.

Key highlights:
- Real-time hotel and flight data via Amadeus and Traveloka APIs
- Interactive itineraries with map visualization (Google Maps API)
- Weather forecasts and currency conversion tools
- Custom database to store user data, preferences, and bookings
- Admin dashboard for content moderation, analytics, and user management

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB (local or Atlas)
- `.env` file with the following keys:
  ```env
  MONGO_URI=your_mongodb_connection_string
  STRIPE_SECRET_KEY=your_stripe_key
  SESSION_SECRET=your_session_secret
  ```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/journeysync.git
   cd journeysync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the app**
   Navigate to `http://localhost:3000` in your browser.

---

## 🚀 Features and Functionality

### 🧭 User Features
- **Hotel Search & Booking**  
  Search and compare hotels via Amadeus and Traveloka APIs. View amenities, prices, and availability.

- **Custom Itinerary Builder**  
  Create detailed day-by-day itineraries including activities, transportation, and accommodations.

- **Map Integration**  
  Visualize travel routes and destinations on interactive maps using Google Maps.

- **Flight Information**  
  Access real-time flight details including schedules and prices.

- **Weather Forecasts**  
  Plan with confidence using current and forecasted weather data.

- **Currency Exchange Rates**  
  View up-to-date conversion rates for budgeting and planning.

- **Trip Sharing**  
  Share itineraries via link or download for collaborative planning.

### 👨‍💼 Admin Features
- **User Management**  
  Monitor, update, or remove user accounts securely.

- **Content Moderation**  
  Approve or reject user-generated reviews to maintain platform quality.

- **Analytics Dashboard**  
  Visualize usage statistics, trends, and platform metrics.

- **System Maintenance**  
  Manage API health, database backups, and system logs.

---

## 🔗 API Integrations

| API | Purpose | Data Used |
|-----|---------|-----------|
| **Amadeus Hotel Search API** | Real-time hotel search | Hotel names, prices, amenities, reviews |
| **Google Maps API** | Map rendering and trip visualization | Coordinates, distances, routes |
| **Traveloka API** | Alternate hotel listings and booking | Ratings, availability, confirmation |
| **Stripe API** | Dummy payment handling | Transaction ID, payment status |

---

## 🧩 File Structure (Selected Files)

- `db.js` – MongoDB database configuration
- `password.js` – Password hashing and comparison
- `server.js` – Express server setup
- `admin.js`, `auth.js`, `hotels.js`, `itineraries.js` – Route handlers
- `AdminLog.js`, `Booking.js`, `Itinerary.js`, `Review.js`, `SavedItem.js`, `User.js` – Mongoose models
- `package.json`, `package-lock.json` – Project dependencies

---

## 🛠 Known Bugs / Limitations

- **Flight API Rate Limits:** Some APIs have limited free-tier requests and may time out under high traffic.
- **No Real Payments:** Stripe integration is for demo only. No actual payments are processed.
- **Frontend Dependencies:** This README focuses on backend setup. Ensure the frontend is connected and tested separately.
- **Localization Support:** Currently limited to English; multi-language support is under development.

---

## 👥 Development Team

| Name | Role | Responsibilities |
|------|------|------------------|
| **B Kalainila** | Frontend Design Lead | UI/UX, responsive components |
| **Ananya Joshi** | Backend Systems Lead | Database design, API integration, server logic |
| **Nhat Khang Nguyen** | API Integration Lead | API configuration and optimization |
| **Jaishv Hirenbhai Patel** | Project Coordinator & Testing Lead | Timeline management, QA, testing |

---

## 🗓 Development Timeline (Apr 14 – Jun 13, 2025)

| Milestone | Dates | Highlights |
|-----------|-------|------------|
| **1. Planning & Design** | Apr 14–24 | UI mockups, DB schema, API research |
| **2. Backend Development** | Apr 25–May 5 | Database setup, authentication, API logic |
| **3. Frontend Development** | May 6–16 | Responsive UI, map integration, payment |
| **4. Testing & Refinement** | May 17–29 | Unit testing, performance optimization |
| **5. Finalization & Submission** | May 30–Jun 13 | Deployment, documentation, presentation |

---

## 🤝 Collaboration Tools

- **Discord:** Team communication  
- **GitHub:** Version control & code reviews  
- **Trello:** Task and milestone tracking  
- **Zoom:** Weekly team meetings  
- **Postman:** API testing  
- **Figma:** UI prototyping

---

## 📄 License

This project is for academic use only and is not licensed for commercial deployment.

---
