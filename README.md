# Scam Shield AI

**Think Before You Click.**

Scam Shield AI is an AI-powered cybersecurity platform designed to detect, analyze, and explain modern digital scams such as phishing, UPI fraud, fake KYC requests, lottery scams, investment fraud, fake job offers, and social-engineering attacks.

Unlike a basic **“Safe / Unsafe”** detector, Scam Shield AI acts as a **forensic threat analyst**. It evaluates suspicious communication, identifies psychological manipulation tactics, analyzes URLs and domain patterns, assesses potential financial risk, and generates actionable containment recommendations.

## Key Features

*  **AI-Powered Scam Detection** using Gemini 2.5 Flash
*  **Forensic Threat Analysis** with risk scoring from 0–100
*  **Red Flag Detection** for suspicious phrases and behaviors
*  **Social Engineering Analysis** including urgency, fear, impersonation, and FOMO
*  **URL & Domain Analysis** for suspicious links and deceptive structures
*  **Financial Risk Assessment**
*  **Actionable Containment Protocols**
*  **Multilingual Analysis** in English, Hindi, and Marathi
*  **Interactive Threat Intelligence Dashboard**
*  **Historical Incident Vault** with scan history
*  **PDF Forensic Reports**
*  **Firebase Authentication**
*  **Firestore Cloud Persistence**
*  **Heuristic Fallback Engine** for analysis when AI services are unavailable
*  **Cybercrime Emergency Hub** with India's 1930 cyber fraud helpline information

##  AI & LLM Architecture

Scam Shield AI uses **Gemini 2.5 Flash** through the official Google Gen AI SDK.

The model produces structured JSON using a defined response schema containing:

* Risk Score
* Risk Level
* Scam Category
* Confidence
* Red Flags
* Social Engineering Tactics
* Financial Risk
* URL Risk
* Explanation
* Recommended Actions
* Things to Avoid

This structured approach allows the AI output to be transformed into an interactive **Scam Intelligence Report** rather than a simple chatbot response.

##  System Architecture

```text
User
 │
 ▼
React + TypeScript Frontend
 │
 ▼
Express / Node.js Backend
 │
 ├──────────────► Gemini 2.5 Flash
 │                     │
 │                     ▼
 │              Structured JSON
 │
 └──────────────► Heuristic Fallback Engine
                       │
                       ▼
              Forensic Threat Dossier
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       Web Dashboard        Firestore
             │
             ▼
       PDF Report
```

##  Technology Stack

### Frontend

* React 19
* TypeScript
* Tailwind CSS
* Motion
* Lucide React

### Backend

* Node.js
* Express
* TypeScript
* Vite
* esbuild

### AI

* Google Gen AI SDK
* Gemini 2.5 Flash
* Structured JSON Schema
* Server-side heuristic fallback engine

### Database & Authentication

* Firebase Authentication
* Google OAuth
* Firestore

### Visualization & Reporting

* Recharts
* Custom SVG Risk Gauge
* jsPDF

##  Security Approach

Security is built into the architecture:

* Gemini API credentials remain server-side
* Environment variables are used for secrets
* Input validation is implemented before analysis
* Authentication protects user-specific data
* Firestore is used for cloud persistence
* Guest users can use local storage for recent scans
* Sensitive credentials such as OTPs, passwords, PINs, and card details should never be submitted

##  Target Use Cases

Scam Shield AI can help users analyze:

* SMS scams
* WhatsApp scams
* Phishing emails
* Fake KYC / banking messages
* UPI & QR payment scams
* Fake job offers
* Lottery & prize scams
* Investment scams
* Suspicious URLs
* Social-media scams
* Phone-call scam scripts

## Multilingual Cybersecurity

Scam Shield AI is designed with Indian users in mind, supporting:

**English | हिंदी | मराठी**

The system can provide threat explanations and safety recommendations in the selected language, making cybersecurity guidance more accessible to regional-language users.

##  Future Roadmap

*  Screenshot-based scam detection
*  Browser extension
*  Android application
*  Advanced URL reputation intelligence
*  Voice scam detection
*  Open-weight LLM integration
*  Real-time threat intelligence feeds
*  Community-driven scam reporting
*  Emerging scam pattern detection

## Disclaimer

Scam Shield AI provides **AI-assisted risk assessment**, not definitive proof that content is malicious or legitimate. Users should verify important security information through official channels and should never share passwords, OTPs, UPI PINs, or other sensitive credentials.

---

###  Scam Shield AI

**AI-powered cybersecurity for safer digital decisions.**

**Think Before You Click.**
