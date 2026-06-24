# Delivery ETA Frontend — Dispatch Console

A React interface for the Delivery ETA Predictor — styled as a logistics dispatch console rather than a generic form, to match the subject matter.

This is the frontend half of a two-part project. See the backend here: [delivery-eta-backend](https://github.com/Ruchipatle87/delivery-eta-backend)

---

## What this does

Lets a user enter order details (distance, weather, traffic, rider info) and see a live predicted delivery time, returned by a self-trained Random Forest model running on a FastAPI backend.

---

## Design

- Theme: dark "dispatch console" — order details styled as a dispatch ticket, prediction shown on an animated radial ETA dial (like a radar gauge)
- Palette: near-black charcoal background, amber accent for live data, cyan accent for secondary route info
- Typography: Rajdhani (technical/condensed) for headers, Inter for body text, JetBrains Mono for the numeric readout
- Key Factors panel: illustrative breakdown of traffic, distance, and weather influence, informed by SHAP feature importance findings from the backend model

---

## Tech stack

- React (Vite)
- Tailwind CSS
- lucide-react — icons

---

## Running locally

npm install
npm run dev

Visit http://localhost:5173/

Important: this frontend calls a FastAPI backend at http://127.0.0.1:8000/predict. Make sure the backend is running locally (or update the fetch URL to a deployed backend) for predictions to work.

---

## Project structure

delivery-eta-frontend/
- src/App.jsx (main dispatch console component)
- src/main.jsx
- src/index.css
- tailwind.config.js
- package.json
