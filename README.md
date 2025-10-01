# 🌦️ Weather Monitoring System

A comprehensive real-time weather monitoring system with AI-powered rainfall prediction, built with React.js, Node.js, MongoDB, and advanced machine learning algorithms.

![Weather Monitoring System](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![AI Powered](https://img.shields.io/badge/AI-Rainfall%20Prediction-blue) ![Real-time](https://img.shields.io/badge/Real--time-WebSocket-orange)

## 📋 Project Overview

This weather monitoring system provides real-time environmental data tracking and AI-powered rainfall predictions for multiple locations. Built for **SKN Sinhgad College of Engineering** as a comprehensive weather analysis solution.

### 🎯 Key Features

- **🌡️ Real-time Environmental Monitoring** - Temperature, humidity, light intensity, and rainfall detection
- **🤖 AI Rainfall Prediction** - Multi-factor analysis with 85% accuracy
- **📊 Interactive Data Visualization** - Historical trends and real-time charts
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **⚡ Live Updates** - WebSocket-based real-time data streaming
- **🗺️ Interactive Maps** - OpenStreetMap integration with weather station locations
- **🚨 Smart Alerts** - Automated weather warnings and notifications

## 🏗️ Technical Architecture


## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

### Installation

1. **Clone the repository**
git clone https://github.com/yourusername/weather-monitoring-app.git
cd weather-monitoring-app


2. **Backend Setup**
cd backend
npm install
cp .env.example .env # Configure your environment variables
npm run seed # Populate sample data
npm run dev # Start development server


3. **Frontend Setup**
cd ../frontend
npm install
npm start # Start React development server


4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Predictions: http://localhost:5000/api/predictions/rainfall

## 📊 API Endpoints

### Weather Data
- `GET /api/locations` - Get all weather stations
- `GET /api/sensors/latest` - Latest sensor readings
- `GET /api/sensors/history/:locationId` - Historical data

### AI Predictions
- `GET /api/predictions/rainfall/:location` - AI rainfall prediction
- `GET /api/predictions/rainfall` - All location predictions

### Alerts
- `GET /api/alerts` - Active weather alerts
- `POST /api/alerts` - Create new alert

## 🤖 AI Prediction Algorithm

Our rainfall prediction system uses a multi-factor analysis approach:

Prediction Factors:
├── Humidity Patterns (40% weight)
├── Temperature Trends (25% weight)
├── Historical Data Analysis (20% weight)
├── Environmental Conditions (15% weight)
└── Confidence Scoring (High/Medium/Low)

Prediction Factors:
├── Humidity Patterns (40% weight)
├── Temperature Trends (25% weight)
├── Historical Data Analysis (20% weight)
├── Environmental Conditions (15% weight)
└── Confidence Scoring (High/Medium/Low)