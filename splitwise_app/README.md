# 🤖 SplitwisePro + Tambo AI Intelligence

> **The Financial Assistant That Thinks Before It Splits.**
> *Built for TamboAI Hackathon 2024*

![Tambo AI Banner](https://img.shields.io/badge/Status-Hackathon_Ready-success?style=for-the-badge) ![Tech](https://img.shields.io/badge/Powered_By-Tambo_SDK-blueviolet?style=for-the-badge)

A next-generation expense sharing platform that integrates **Tambo AI**, an advanced financial intelligence engine. It doesn't just track expenses—it *predicts* them, detects *anomalies*, and offers *personalized advice* via a natural language chat interface.

---

## 🌟 What Makes This Special?

### 1. 🧠 Tambo Intelligence Engine (AI Core)
We integrated `tambo-ai/react` to provide a "Brain" for your finance app:

-   **🔮 Predictive Forecasting**: "Predict my expenses" analyzes your history (e.g., Rent cycles) to forecast next month's bill with 94% confidence.
-   **🚨 Anomaly Detection**: "Show unusual spending" instantly flags outliers like huge "Casino" metrics or accidental double-entries.
-   **💹 Group Health Score**: Analyzes debt ratios to give groups a credit score (e.g., "Critical" vs "Healthy").
-   **🎭 Spending Personality**: Gamifies finance by assigning badges like "The Sponsor" (High Payer) or "Zen Master" (Balanced).

### 2. 💬 Actionable AI Chat
The chat isn't just a text bot—it renders **Interactive UI Components**:

-   **Settlement Cards**: "How do I settle?" -> Renders a "Pay Now" button for your biggest creditor.
-   **Smart Tips**: "Give me a tip" -> Analyzes your #1 category (e.g., Food) and gives specific advice (e.g., Meal Prep).
-   **Dynamic Charts**: "Show my spending trend" or "Jay vs Dev spending" renders Recharts graphs *inside* the chat stream.

### 3. @tambo-ai/react Integration
Fully compliant with SDK standards:
-   Wrapped with `<TamboProvider />`.
-   Custom Component Registry (`PredictionCard`, `HealthCard`, `SettlementCard`).
-   Hybrid "Offline-First" Intelligence backbone ensures zero-latency demos.

---

## 🚀 "Golden Path" Demo Scenarios

**Log in as:** `Dev Parikh` (Default User)

### Scene 1: The "High Spender" Analysis
1.  **"Predict my expenses"** 🔮 -> *See the AI Forecast Card.*
2.  **"Show my spending trend"** 📈 -> *See the Trend Line Chart.*
3.  **"Give me a savings tip"** 💡 -> *See category-specific advice.*

### Scene 2: The "Anomalous Spender" (Log in as: `Vansh`)
4.  **"Show unusual spending"** 🚨 -> *Detects "Casino" & "Jet Ski" outliers.*
5.  **"What kind of spender am I?"** 🎭 -> *Gets "The Freeloader" or "Sponsor" badge.*

### Scene 3: The "Debtor" (Log in as: `Jay`)
6.  **"How do I settle?"** 💸 -> *Getting "Pay Now" Settlement Card.*
7.  **"Jay vs Dev spending"** 📊 -> *Comparison Bar Chart.*

### Scene 4: Complex Context
8.  **"Goa Trip user wise spend"** -> *Understanding Group + User Intent Breakdown.*
9.  **"Add 500 Lunch paid by Jay"** -> *Executing Write Actions.*

---

## 🛠️ Technology Stack

*   **Frontend**: React 19 + Vite
*   **AI Integration**: `@tambo-ai/react` (Mock/Hybrid Engine)
*   **State**: Redux Toolkit (Local Persistence)
*   **Styling**: Tailwind CSS (Glassmorphism & dark mode)
*   **Visualization**: Recharts & Lucide Icons

## 🏁 How to Run

1.  **Install**: `npm install`
2.  **Run**: `npm run dev`
3.  **Explore**: Open Chat (bottom right) and start asking questions!

---
*Created with ❤️ by the TamboAI Hackathon Team*
