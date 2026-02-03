# 🌍 Air Quality Visualizer

A high-performance web application for exploring **real-time global air quality data** through an interactive map interface.  
Built with modern React tooling and optimized for speed, clarity, and scalability.

The app consumes live data from the **WAQI (World Air Quality Index) API**, presenting actionable environmental insights in an intuitive visual format.

---

## 🚀 Features

### 📍 Smart Geolocation
- **Auto-Detect on Load**  
  Automatically identifies the nearest air quality monitoring station using IP-based geolocation.
- **Manual “Locate Me” Action**  
  Instantly return to your local air quality data via a dedicated button in the search bar.

### 🗺️ Interactive Map
- **Live AQI Markers**  
  Each station marker displays the actual AQI value directly on the map.
- **Color-Coded Severity System**
  - Emerald 🟢 — Good  
  - Yellow 🟡 — Moderate  
  - Orange 🟠 — Unhealthy for Sensitive Groups  
  - Red 🔴 — Unhealthy  
  - Purple 🟣 — Very Unhealthy  
  - Rose 🟤 — Hazardous
- **Detailed Marker Popups**  
  Click any marker to view pollutant breakdowns including:
  - PM2.5
  - PM10
  - O₃ (Ozone)

### 🔍 Advanced Search & History
- **Global City & Region Search**  
  Instantly search air quality data anywhere in the world.
- **Smart Search History**
  - Recent searches are persisted locally.
  - Selecting a history item re-centers the map and re-fetches live station data automatically.

---

## 🛠️ Tech Stack

### Core
- **React 19**
- **Vite**

### Styling
- **Tailwind CSS v4**
- Native Vite plugin

### Mapping
- **Leaflet**
- **CartoDB Dark Matter** tiles

### State & Data
- **Zustand**
- **Zustand Persist**
- **TanStack Query (React Query)**

### API
- **WAQI API**

---

## 📦 Installation & Setup

```bash
git clone https://github.com/your-username/air-quality-visualizer.git
cd air-quality-visualizer
npm install
npm run dev
```

The app will be available at:
```
http://localhost:5173
```

## 🔐 Environment Variables
Create a .env file in the project root:
```
VITE_WAQI_TOKEN=your_waqi_api_token
```
Get your token from the official WAQI website.
