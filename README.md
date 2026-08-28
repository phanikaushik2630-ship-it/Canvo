# 🥖 Canvo — Conversational AI Platform for Local Commerce

> **A production-ready AI Concierge & Commerce SaaS designed for local businesses** (cafés, artisan bakeries, gyms, boutiques, and salons). Powered by React, TypeScript, Node.js/Express, SSE streaming, strict negative grounding, and in-chat conversion workflows.

🌐 **Live Demo**: **[https://canvo-business-app.netlify.app](https://canvo-business-app.netlify.app)**  
📁 **GitHub**: **[https://github.com/phanikaushik2630-ship-it/Canvo](https://github.com/phanikaushik2630-ship-it/Canvo)**

---

## 🚀 Key Highlights & Features

- **Multi-Tenant Architecture**: Complete tenant data isolation for business profiles, operating schedules, catalog items, FAQs, and custom AI guardrails.
- **Strict Negative Grounding AI Engine**:
  - SSE real-time streaming with Anthropic Claude API (`claude-3-5-haiku` / `claude-3-5-sonnet`).
  - Resilient local deterministic grounding fallback that only answers verified business facts and politely declines hallucinated or out-of-scope inquiries.
- **In-Chat Commerce & Ordering**:
  - Direct customer takeout ordering with live quantity selectors, price tally, and dietary tags.
  - In-chat table and appointment booking with party size, date/time, and patio/indoor seating preferences.
- **Owner Business Suite & Dashboard**:
  - **Operating Hours Editor**: Special holiday notes, split shifts, and open/closed toggles.
  - **Menu & Catalog Manager**: Categories, ingredients, preparation notes, pricing, and sold-out toggles.
  - **Multi-Currency Engine**: Live 6-hour cached exchange rate service (USD, EUR, GBP, INR, CAD, AUD, etc.).
  - **FAQ Knowledge Base**: Instant Q&A synchronization.
  - **Interactive Live Sandbox**: Test bot responses, tones, and directives in real-time.
- **Orders Inbox**: Full order lifecycle management (`New` → `Confirmed` → `Completed` → `Cancelled`).
- **Analytics & Insights**:
  - Conversation volume metrics and peak hours distribution.
  - Top asked customer questions & unanswered query gap detection.
  - Searchable chat logs with 1-click CSV export.
- **Embeddable Chat Widget**: Standalone iframe widget and code generator for 1-line integration into external websites.
- **Enterprise-Grade Auth**: JWT authentication with a 6-digit OTP verification flow for secure password resets.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, Vite
- **Backend**: Node.js, Express, Server-Sent Events (SSE), JSON Database Layer
- **AI & Grounding**: Anthropic Claude API (`@anthropic-ai/sdk`) + Custom Deterministic Grounding Fallback Engine
- **Auth & Security**: JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), OTP validation

---

## 📂 Project Structure

```
Canvo/
├── server/
│   ├── auth.js            # JWT auth & 6-digit OTP password reset engine
│   ├── db.js              # Multi-tenant data layer & schema persistence
│   ├── index.js           # Express API, SSE streaming, live rates & intent parser
│   └── data/              # Seeded & runtime database storage
├── src/
│   ├── components/
│   │   ├── auth/          # Login, Registration & OTP Password Modals
│   │   ├── chat/          # ChatWindow, Streaming Messages, OrderActionCards
│   │   ├── common/        # Nav, Toast notifications, ErrorBoundary
│   │   ├── dashboard/     # Analytics, Orders Inbox, Bot Customizer, Embed Gen
│   │   ├── embed/         # Standalone Iframe Embed Widget
│   │   └── owner/         # Hours, Menu, FAQ, AI Guardrails, Live Sandbox
│   ├── context/           # Auth, Business, and Chat state providers
│   ├── pages/             # PlatformHome, BusinessStorefront, DashboardPage, EmbedView
│   ├── services/          # API client & SSE streaming adapters
│   └── types/             # TypeScript domain definitions
└── test_*.js              # Automated end-to-end verification suites
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/canvo-ai-platform.git
cd canvo-ai-platform

# Install dependencies
npm install
```

### 3. Environment Setup (Optional)
Create a `.env` file in the root directory:
```env
PORT=3001
# Optional: Anthropic API key for live Claude model streaming.
# If omitted, Canvo uses its built-in local grounding engine automatically.
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
- **Web App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

### 5. Build for Production
```bash
npm run build
```

---

## 🧪 Automated Verification Suites

Run the included automated test scripts to verify all platform subsystems:

```bash
# Verify grounding, multi-tenant isolation, and order/booking intents
node verify_all_flows.js

# Verify full In-Chat Ordering & Orders Inbox lifecycle
node test_phase4.js

# Verify JWT Auth and 6-digit OTP password reset flow
node test_auth_and_forgot_password.js

# Verify Multi-Currency and live exchange rates caching
node test_multicurrency.js
```

---

## 👥 Demo Credentials
- **Email**: `demo@canvo.app`
- **Password**: `demo123`

---

## 📄 License
This project is licensed under the MIT License.
