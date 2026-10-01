<div align="center">

# 🌱 AgriGuard AI

### From Farm Data to the Right Action.

**AI-powered, weather-aware irrigation decision support for smarter and more sustainable agriculture.**

<br/>

![React](https://img.shields.io/badge/React-2026-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google)

</div>

---

## 🌾 About AgriGuard AI

**AgriGuard AI** is an AI-powered irrigation decision support system designed to help farmers answer one simple but important question:

> **"Should I irrigate now or wait?"**

Instead of only displaying farm data, AgriGuard AI combines **soil conditions, crop information, and weather conditions** to convert raw data into an actionable irrigation recommendation.

### Core Approach

```text
Farm Data
    ↓
Weather Data
    ↓
Decision Engine
    ↓
Irrigation Recommendation
    ↓
AI Explanation
    ↓
Actionable Decision

The system provides three primary recommendations:

🚰 IRRIGATION RECOMMENDED
🌧️ WAIT — RAIN EXPECTED
✅ NO IRRIGATION NEEDED
🎯 Problem

Traditional irrigation decisions often depend on:

Manual observation
Fixed irrigation schedules
Limited weather information
Inconsistent monitoring of soil moisture
Lack of centralized farm insights

These approaches can lead to unnecessary irrigation or delayed irrigation during dry conditions.

AgriGuard AI addresses this problem by combining multiple environmental factors and converting them into a simple recommendation.

💡 Solution

AgriGuard AI analyzes:

🌱 Soil Moisture
🌡️ Temperature
💧 Humidity
🌧️ Rain Probability
🌾 Crop Type
🌿 Growth Stage
🚰 Water Tank Level
🌦️ Weather Conditions

The system then generates an understandable irrigation decision.

             FARM CONDITIONS
                    │
                    ▼
        ┌─────────────────────┐
        │   Decision Engine   │
        └──────────┬──────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   Weather Data          Farm Data
        │                     │
        └──────────┬──────────┘
                   ▼
          Irrigation Decision
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
       Irrigate   Wait     No Need
✨ Features
🚰 Smart Irrigation Recommendations

Provides one of three decisions based on current farm conditions:

🚰 IRRIGATION RECOMMENDED
🌧️ WAIT — RAIN EXPECTED
✅ NO IRRIGATION NEEDED
🌦️ Weather-Aware Decision Making

The system considers upcoming weather conditions along with farm data.

Important weather factors include:

Rain probability
Temperature
Humidity
Weather condition
Hourly forecast

This helps avoid recommending irrigation when significant rainfall is expected.

🌱 Real-Time Farm Condition Dashboard

The dashboard provides an overview of:

Soil moisture
Temperature
Humidity
Rain probability
Water tank storage
Crop
Growth stage
Irrigation status
🤖 AI-Powered Explanation

The AI layer explains why a particular recommendation was generated.

Example:

Soil moisture is currently 18%, which is low,
while rainfall probability is only 20%.

Based on these conditions, irrigation is recommended.

The AI layer is used primarily for explanation and assistance, while the core decision engine can continue working independently.

🧪 Farm Simulator

The simulator allows users to test different environmental conditions without physical sensors.

Users can modify:

Soil Moisture
Temperature
Humidity
Rain Probability
Crop
Growth Stage

Example:

Soil Moisture     → 18%
Rain Probability → 20%

        ↓ ANALYZE

🚰 IRRIGATION RECOMMENDED

Change the weather:

Soil Moisture     → 18%
Rain Probability → 85%

        ↓ ANALYZE

🌧️ WAIT — RAIN EXPECTED
🔮 What-If Analysis

Users can explore how changing environmental conditions affects irrigation decisions.

CURRENT CONDITION

Soil Moisture: 18%
Rain Probability: 20%

        ↓

🚰 Irrigation Recommended
WHAT-IF CONDITION

Soil Moisture: 18%
Rain Probability: 80%

        ↓

🌧️ Wait — Rain Expected

This demonstrates the system's ability to respond to changing conditions.

📜 Recommendation History

Users can review previous irrigation decisions.

History can include:

Date & time
Crop
Soil moisture
Temperature
Rain probability
Decision
Irrigation duration
Decision explanation
📊 Farm Analytics

The application provides visual insights into farm conditions and irrigation activity.

Examples:

Soil moisture trends
Irrigation history
Water consumption
Recommendation trends
🔔 Smart Notifications

Notifications can alert users about:

Low soil moisture
Expected rainfall
Scheduled irrigation
Water tank conditions
Important farm events
🎙️ Ask AgriGuard AI

The built-in AI assistant allows users to ask questions about their farm.

Example:

"Should I irrigate my wheat field today?"

"Why is irrigation recommended?"

"What happens if rain is expected tonight?"
🌐 Language Support

The application supports:

🇬🇧 English
🇮🇳 Hindi

The interface is designed to make agricultural insights easier to understand.

🌙 Dark & Light Mode

AgriGuard AI supports a responsive interface with:

Dark Mode
Light Mode
Responsive layouts
Mobile-friendly navigation
🧠 Decision Engine

The current prototype uses a deterministic decision engine.

Prototype Logic
IF soil moisture < 25%
AND rain probability < 40%

        ↓

🚰 IRRIGATION RECOMMENDED
IF soil moisture < 25%
AND rain probability >= 40%

        ↓

🌧️ WAIT — RAIN EXPECTED
IF soil moisture >= 25%

        ↓

✅ NO IRRIGATION NEEDED

Note: These thresholds are prototype/demo rules and are not scientifically validated irrigation thresholds. A production system would require crop-specific agronomic data, soil characteristics, local climate information, evapotranspiration data, field calibration, and real sensor measurements.

🏗️ System Architecture
                    ┌──────────────────┐
                    │      Farmer      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  React Frontend  │
                    │   + Vite + UI    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Node.js +        │
                    │ Express Backend  │
                    └───────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌────────────┐
        │ MongoDB  │  │ Weather  │  │  Decision  │
        │ Database │  │   API    │  │   Engine   │
        └──────────┘  └──────────┘  └─────┬──────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Gemini AI    │
                                    │ Explanation  │
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Recommendation│
                                    └──────────────┘
🛠️ Tech Stack
Frontend
React.js
Vite
JavaScript
JSX
Tailwind CSS
React Router
Lucide React
Recharts
Backend
Node.js
Express.js
REST APIs
Database
MongoDB
Mongoose
AI
Google Gemini API
Authentication
JWT
bcrypt
External Services
Weather API
Development Tools
VS Code
Git
GitHub
Postman
📁 Project Structure
AgriGuard-AI/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── server/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── middleware/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
🔌 API Endpoints
Method	Endpoint	Description
POST	/api/auth/login	User login
POST	/api/auth/signup	User registration
GET	/api/farm	Fetch farm data
PUT	/api/farm	Update farm data
POST	/api/recommendation/analyze	Generate irrigation recommendation
GET	/api/recommendation/history	Fetch recommendation history
GET	/api/weather	Fetch weather data
POST	/api/ai/chat	AI assistant
POST	/api/irrigation/schedule	Schedule irrigation
GET	/api/notifications	Fetch notifications
🔐 Environment Variables

Create a .env file and configure the required environment variables.

PORT=3000

GEMINI_API_KEY=your_gemini_api_key

MONGODB_URI=your_mongodb_connection_string

WEATHER_API_KEY=your_weather_api_key

JWT_SECRET=your_jwt_secret

VITE_API_URL=/api

VITE_BACKEND_URL=http://localhost:3000
⚠️ Security

Never commit API keys or secrets to GitHub.

Make sure your .gitignore contains:

.env
.env.local
.env.*.local
🚀 Installation
1. Clone the Repository
git clone https://github.com/paridhiagra/AgriGaurd-Ai.git
2. Open the Project
cd AgriGaurd-Ai
3. Install Dependencies
npm install
4. Configure Environment Variables

Create a .env file using .env.example as reference.

5. Start the Backend
npm run dev:server
6. Start the Frontend

Open another terminal:

npm run dev
7. Open the Application
http://localhost:5173
🧪 Demo Scenarios
Scenario 1 — Dry Field
Soil Moisture     : 15%
Rain Probability  : 10%
Temperature       : 32°C

Result:

🚰 IRRIGATION RECOMMENDED
Scenario 2 — Rain Expected
Soil Moisture     : 18%
Rain Probability  : 85%
Temperature       : 30°C

Result:

🌧️ WAIT — RAIN EXPECTED
Scenario 3 — Sufficient Moisture
Soil Moisture     : 45%
Rain Probability  : 20%
Temperature       : 27°C

Result:

✅ NO IRRIGATION NEEDED
👨‍🌾 User Flow
                    ┌─────────┐
                    │  Login  │
                    └────┬────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  Dashboard   │
                  └──────┬───────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Farm          Weather       AI Decisions
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                 Irrigation Decision
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
          Irrigate      Wait      No Need
              │          │          │
              └──────────┼──────────┘
                         ▼
                Recommendation
                     History
🌍 Sustainable Agriculture

AgriGuard AI focuses on the Sustainable Agriculture domain by supporting better irrigation decisions.

The system is designed to help:

💧 Reduce unnecessary irrigation
🌱 Improve irrigation timing
🌦️ Consider upcoming rainfall
📊 Encourage data-driven farming
🧑‍🌾 Simplify farm decision-making
🌍 Support sustainable water management

The project does not claim a specific percentage of water savings because such results require real-world testing and validation.

🔮 Future Scope
IoT & Hardware Integration

The software prototype can later be connected to real agricultural sensors.

Soil Moisture Sensor
        │
Temperature Sensor
        │
Humidity Sensor
        │
Water Level Sensor
        │
        ▼
      ESP32
        │
        ▼
   AgriGuard AI
        │
        ▼
Decision Engine
        │
        ▼
Irrigation System

Potential hardware:

ESP32
Soil moisture sensor
Temperature sensor
Humidity sensor
Water-level sensor
Water flow sensor
Automated irrigation pump
Advanced AI

Future versions could include:

Crop-specific irrigation models
Soil-type analysis
Evapotranspiration-based decisions
Historical farm learning
Predictive irrigation planning
Satellite/remote sensing data
Automated irrigation control
Voice-based local-language assistance
📌 Current Status
🚧 Prototype / Hackathon Project

The current version focuses on software-based irrigation decision support using simulated/manual farm data and weather information.

Future versions can integrate real-time IoT sensors and automated irrigation hardware.

🏆 Project Vision

AgriGuard AI follows one simple principle:

┌──────────────────────────────────────┐
│                                      │
│       Don't just show the data.      │
│                                      │
│       Turn data into a decision.     │
│                                      │
└──────────────────────────────────────┘
<div align="center">
🌱 AgriGuard AI
From Farm Data to the Right Action.

Built for smarter and more sustainable agriculture.

</div> 
