<div align="center">

# 🌱 AgriGuard AI

### From Farm Data to the Right Action.

AI-powered, weather-aware irrigation decision support for smarter and more sustainable agriculture.

<br>

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

<br>

<a href="YOUR_LIVE_LINK">🌐 Live Demo</a>
&nbsp;&nbsp;•&nbsp;&nbsp;
<a href="https://github.com/paridhiagra/AgriGaurd-Ai">💻 GitHub Repository</a>

</div>

---

## 🌾 About

AgriGuard AI is an AI-powered irrigation decision support system designed to help farmers answer one simple question:

> **Should I irrigate now or wait?**

Instead of simply displaying farm data, AgriGuard AI combines soil conditions, crop information, and weather conditions to turn raw data into a clear and actionable irrigation recommendation.

---

## 🎯 Problem

Traditional irrigation decisions often depend on:

- Manual observation
- Fixed irrigation schedules
- Limited weather information
- Inconsistent soil monitoring

These approaches can lead to unnecessary irrigation or delayed irrigation during dry conditions.

---

## 💡 Solution

AgriGuard AI combines:

- 🌱 Soil Moisture
- 🌡️ Temperature
- 💧 Humidity
- 🌧️ Rain Probability
- 🌾 Crop Type
- 🌿 Growth Stage
- 🚰 Water Availability
- 🌦️ Weather Conditions

and converts them into three simple decisions:

### 🚰 IRRIGATION RECOMMENDED

### 🌧️ WAIT — RAIN EXPECTED

### ✅ NO IRRIGATION NEEDED

---

## ✨ Features

- 🚰 Smart Irrigation Recommendations
- 🌦️ Weather-Aware Decision Making
- 🤖 AI-Powered Explanations
- 🧪 Farm Simulator
- 🔮 What-If Analysis
- 📜 Recommendation History
- 📊 Farm Analytics
- 🔔 Smart Notifications
- 🎙️ Ask AgriGuard AI
- 🌐 English & Hindi Support
- 🌙 Dark & Light Mode
- 📱 Responsive Interface

---

## 🧠 How It Works

```text
Farm Data
    +
Weather Data
    ↓
Decision Engine
    ↓
Irrigation Recommendation
    ↓
AI Explanation
    ↓
Actionable Decision
```

### Core Principle

**Don't just show the data. Turn data into a decision.**

---

## 🚰 Smart Irrigation Decision

AgriGuard AI evaluates current farm and weather conditions to generate an irrigation recommendation.

```text
🌱 Low Soil Moisture
        +
🌧️ Low Rain Probability
        ↓
🚰 IRRIGATION RECOMMENDED
```

```text
🌱 Low Soil Moisture
        +
🌧️ High Rain Probability
        ↓
🌧️ WAIT — RAIN EXPECTED
```

```text
🌱 Sufficient Soil Moisture
        ↓
✅ NO IRRIGATION NEEDED
```

---

## 🤖 AI-Powered Explanation

The AI layer explains why a particular recommendation was generated.

Example:

> Soil moisture is currently low while rainfall probability is also low. Based on these conditions, irrigation is recommended.

Gemini AI can be used for explanations and conversational assistance, while the core decision engine can continue working independently.

---

## 🌦️ Weather-Aware Recommendations

Weather conditions are considered before generating an irrigation recommendation.

Important factors include:

* Rain probability
* Temperature
* Humidity
* Current weather
* Hourly forecast

This helps avoid recommending irrigation when significant rainfall is expected.

---

## 🧪 Farm Simulator

The Farm Simulator allows users to test different environmental conditions without physical sensors.

Users can modify:

* Soil Moisture
* Temperature
* Humidity
* Rain Probability
* Crop Type
* Growth Stage

### Example

```text
Soil Moisture    : 18%
Rain Probability : 20%

        ↓ ANALYZE

🚰 IRRIGATION RECOMMENDED
```

---

## 🔮 What-If Analysis

What-If Analysis allows users to explore how changing environmental conditions can affect the irrigation decision.

### Current Condition

```text
Soil Moisture    : 18%
Rain Probability : 20%

        ↓

🚰 Irrigation Recommended
```

### What-If Condition

```text
Soil Moisture    : 18%
Rain Probability : 80%

        ↓

🌧️ Wait — Rain Expected
```

---

## 📊 Farm Analytics

AgriGuard AI provides visual insights into farm conditions and irrigation activity.

Analytics include:

* Soil moisture trends
* Irrigation activity
* Water consumption
* Recommendation trends
* Historical farm conditions

---

## 📜 Recommendation History

Users can review previous irrigation decisions and understand the conditions that led to each recommendation.

History can include:

* Date & Time
* Crop
* Soil Moisture
* Temperature
* Rain Probability
* Decision
* Irrigation Duration
* Decision Explanation

---

## 🔔 Smart Notifications

The notification system can alert users about important farm events such as:

* Low soil moisture
* Expected rainfall
* Scheduled irrigation
* Water tank conditions
* Important farm updates

---

## 🎙️ Ask AgriGuard AI

The built-in AI assistant allows users to ask questions about their farm.

Example questions:

```text
"Should I irrigate my wheat field today?"

"Why is irrigation recommended?"

"What happens if rain is expected tonight?"
```

---

## 🌐 Language Support

The application supports:

* 🇬🇧 English
* 🇮🇳 Hindi

The interface is designed to make agricultural insights easier to understand.

---

## 🌙 Dark & Light Mode

AgriGuard AI supports:

* 🌙 Dark Mode
* ☀️ Light Mode
* 📱 Responsive layouts
* 🧭 Mobile-friendly navigation

---

## 🧠 Decision Engine

The current prototype uses a deterministic decision engine.

### Prototype Logic

```text
IF soil moisture < 25%
AND rain probability < 40%

        ↓

🚰 IRRIGATION RECOMMENDED
```

```text
IF soil moisture < 25%
AND rain probability >= 40%

        ↓

🌧️ WAIT — RAIN EXPECTED
```

```text
IF soil moisture >= 25%

        ↓

✅ NO IRRIGATION NEEDED
```

> **Note:** These thresholds are prototype/demo rules and are not scientifically validated irrigation thresholds. A production system would require crop-specific agronomic data, soil characteristics, local climate information, and field calibration.

---

## 🏗️ System Architecture

```text
                    ┌───────────────┐
                    │    Farmer     │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ React + Vite  │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ Node + Express│
                    └───────┬───────┘
                            ↓
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
         MongoDB       Weather API   Decision Engine
                                           ↓
                                      Gemini AI
                                           ↓
                                    Recommendation
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* JSX
* Tailwind CSS
* React Router
* Recharts
* Lucide React

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* Mongoose

### AI

* Google Gemini API

### Authentication

* JWT
* bcrypt

### External Services

* Weather API

### Development Tools

* VS Code
* Git
* GitHub
* Postman

---

## 📁 Project Structure

```text
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
```

---

## 🔐 Environment Variables

Create a `.env` file and configure the required environment variables:

```env
PORT=3000

GEMINI_API_KEY=your_gemini_api_key

MONGODB_URI=your_mongodb_connection_string

WEATHER_API_KEY=your_weather_api_key

JWT_SECRET=your_jwt_secret

VITE_API_URL=/api

VITE_BACKEND_URL=http://localhost:3000
```

### ⚠️ Security

Never commit API keys, database credentials, or other secrets to GitHub.

Your `.gitignore` should contain:

```gitignore
node_modules/
.env
.env.local
.env.*.local
dist/
```

---

## 🚀 Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/paridhiagra/AgriGaurd-Ai.git
```

### 2. Open the Project

```bash
cd AgriGaurd-Ai
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file using `.env.example` as a reference.

### 5. Start the Backend

```bash
npm run dev:server
```

### 6. Start the Frontend

Open another terminal:

```bash
npm run dev
```

### 7. Open the Application

```text
http://localhost:5173
```

---

## 🧪 Demo Scenarios

### Scenario 1 — Dry Field

```text
Soil Moisture    : 15%
Rain Probability : 10%
Temperature      : 32°C

Result:

🚰 IRRIGATION RECOMMENDED
```

### Scenario 2 — Rain Expected

```text
Soil Moisture    : 18%
Rain Probability : 85%
Temperature      : 30°C

Result:

🌧️ WAIT — RAIN EXPECTED
```

### Scenario 3 — Sufficient Moisture

```text
Soil Moisture    : 45%
Rain Probability : 20%
Temperature      : 27°C

Result:

✅ NO IRRIGATION NEEDED
```

---

## 🌱 Sustainable Agriculture

AgriGuard AI focuses on supporting sustainable agriculture through smarter irrigation decisions.

The system is designed to:

* 💧 Reduce unnecessary irrigation
* 🌱 Improve irrigation timing
* 🌦️ Consider upcoming rainfall
* 📊 Encourage data-driven farming
* 🌍 Support sustainable water management

> The project does not claim a specific percentage of water savings because real-world testing and validation are required.

---

## 🔮 Future Scope

### IoT Integration

The software prototype can later be connected to real agricultural sensors.

```text
Soil Moisture Sensor
        ↓
Temperature Sensor
        ↓
Humidity Sensor
        ↓
Water Level Sensor
        ↓
       ESP32
        ↓
   AgriGuard AI
        ↓
 Decision Engine
        ↓
Irrigation System
```

Future versions could include:

* ESP32-based real-time monitoring
* Soil-type analysis
* Crop-specific irrigation models
* Evapotranspiration-based decisions
* Historical farm learning
* Predictive irrigation planning
* Automated irrigation control
* Satellite / remote sensing data
* Voice-based local-language assistance

---

## 📌 Current Status

**🚧 Prototype / Hackathon Project**

The current version focuses on software-based irrigation decision support using simulated/manual farm data and weather information.

Future versions can integrate real-time IoT sensors and automated irrigation hardware.

---

## 👥 Team

### Team RootRise

| Member               | Role                      |
| -------------------- | ------------------------- |
| **Paridhi Agrawal**  | Frontend & UI/UX          |
| **Esha Chaturvedi** | Backend & API Development |

---

## 🔗 Project Links

### 🌐 Live Demo

[Open AgriGuard AI](YOUR_LIVE_LINK)

### 💻 GitHub Repository

[View Source Code](https://github.com/paridhiagra/AgriGaurd-Ai)

---

<div align="center">

# 🌱 AgriGuard AI

### From Farm Data to the Right Action.

**Don't just show the data. Turn data into a decision.**

<br>

Built for smarter and more sustainable agriculture.

</div>
