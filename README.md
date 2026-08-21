# PromoAlign AI — Personalized Promotion & Inventory Alignment Planner

[![PromoAlign CI Pipeline](https://github.com/Sravanthi-Malothu/Ecommerce-hack/actions/workflows/ci.yml/badge.svg)](https://github.com/Sravanthi-Malothu/Ecommerce-hack/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

**PromoAlign AI** is an enterprise-grade, AI-driven **Personalized Promotion & Inventory Alignment Planner** designed for Retail Category Leads and E-Commerce Merchandisers. It balances promotional revenue lift against supply chain stockout risks, post-discount margin floors, customer offer fatigue, and counterfactual baseline controls.

---

## 🌟 Key Features

1. **🎯 8-Stage End-to-End Retail Data Pipeline**: Traces customer persona -> purchase history -> product affinity -> discount elasticity -> demand forecast -> store stock -> margin floors -> AI rationale recommendation.
2. **🧠 6 Predictive Machine Learning Models**: Sigmoidal Price Elasticity, Cosine Similarity Vectors, Apriori Market Basket Co-Purchase, SHAP Feature Attribution, RFM Segmentation, and Constraint Satisfaction Programming (CSP).
3. **📊 Backtesting & Model Evaluation Suite**: Calculates Precision@k ranking metrics, MAE/RMSE continuous error, Confusion Matrix (TP/FP/TN/FN), and standardized **Model Cards**.
4. **💡 Counterfactual Uplift Estimator**: Measures true incremental revenue and profit lift against matched $d=0$ non-promoted historical control baselines.
5. **🛡️ Production Observability & Resilience**: `AsyncLocalStorage` Correlation ID tracing (`X-Correlation-ID`), zero-dependency Circuit Breakers (`groqBreaker`, `geminiBreaker`, `pythonMlBreaker`), LLM token/cost telemetry, and `/health` status monitoring.

---

## ⚡ Quick Start & Running Locally

### Prerequisites
- Node.js >= 20.0.0
- Python >= 3.10

### 1. Clone & Install Dependencies
```bash
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Start Dev Servers
```bash
# Terminal 1: Start Backend Engine (Port 5001)
cd backend
npm run dev

# Terminal 2: Start Frontend Application (Port 5173)
cd frontend
npm run dev
```

---

## 🧪 Running Automated Test Suites

```bash
# Run all backend automated tests
cd backend
node src/test/engineTest.js
node src/test/pipelineTest.js
node src/test/backtestTest.js
node src/test/resilienceTest.js
node src/test/counterfactualTest.js

# Run frontend linter and production build
cd ../frontend
npm run lint
npm run build
```

---

## 🔄 CI Pipeline & Quality Assurance

This repository includes an automated **GitHub Actions CI Pipeline** (`.github/workflows/ci.yml`) that runs on every `push` and `pull_request`:
- 🔍 **Frontend Linting**: `npm run lint` via Oxlint
- 🧪 **Backend Test Suite Execution**: 5 automated unit test suites
- 🚀 **Frontend Bundle Compilation**: Production build verification
- 📦 **NPM Cache**: Fast CI execution times (<45 seconds)
