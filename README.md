# 📈 Real-Time Stock Market Dashboard

A modern, real-time stock market monitoring platform built with Next.js 15, featuring live market data visualization, interactive charts, and comprehensive financial tracking capabilities.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-8.19.1-47A248?style=flat-square&logo=mongodb)

## ✨ Features

### 📊 Real-Time Market Data
- **Live Market Overview**: Track major indices and market movements with TradingView integration
- **Interactive Stock Heatmap**: Visualize S&P 500 performance by sector with real-time color coding
- **Multi-Tab Navigation**: Quick access to Financial, Technology, and Services sectors
- **Customizable Watchlists**: Save and monitor your favorite stocks

### 🔐 Authentication & User Management
- Secure user authentication system
- Personalized dashboard experience
- User profile management with country selection
- Protected routes with middleware

### 📈 Advanced Visualizations
- **TradingView Widgets Integration**:
  - Market Overview with customizable timeframes
  - Stock Heatmap with market cap visualization
  - Real-time price updates
  - Interactive tooltips and charts

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark mode optimized interface
- Smooth animations with `tw-animate-css`
- Accessible components built with Radix UI
- Professional styling with Tailwind CSS

### 🤖 AI-Powered Features

#### Google Gemini AI Integration
The application leverages **Google Gemini AI** to generate personalized, dynamic content for enhanced user experience.

##### 📧 AI-Generated Welcome Messages
- **Personalized Greetings**: When users sign up, Gemini AI automatically generates a personalized welcome email message tailored to each user's profile
- **Context-Aware Content**: The AI considers user information (name, country, interests) to create relevant and engaging welcome content
- **Automated Background Processing**: A part of welcome email generation will inject into email template to sending asynchronously via Inngest workflows for optimal performance

**How it works:**
1. User completes registration
2. Inngest triggers the `app/user.created` event
3. Gemini AI generates personalized welcome content based on user profile
4. Email is sent with AI-generated message via SMTP

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 19.1.0
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS 3.x with `@tailwindcss/postcss`
  - `clsx` & `tailwind-merge` for dynamic class management
  - `class-variance-authority` for component variants
- **Components**:
  - Radix UI (Dropdown Menu, Avatar, Slot)
  - Custom form components
  - Lucide React Icons

### Backend
- **Database**: MongoDB with Mongoose 8.19.1
- **API**: Next.js API Routes
- **Authentication**: Better Auth
- **Background Jobs**: Inngest
- **Email**: SMTP (Gmail)
- **AI/ML**: Google Gemini AI for content generation
- **Environment**: dotenv for configuration

### Development Tools
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript with strict mode
- **Package Manager**: npm

### External Integrations
- **TradingView**: Real-time market data widgets
- **Google Gemini AI**: AI-powered content generation
- **Axios**: HTTP client for API requests

## 📁 Project Structure

```
p1-realtime-stock-market/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/           # Main application pages
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/              # API routes
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── forms/            # Form components
│   ├── ui/               # Reusable UI components
│   ├── Header.tsx
│   ├── NavItems.tsx
│   ├── UserDropdown.tsx
│   └── TradingViewWidget.tsx
├── database/
│   └── mongoose.ts       # Database configuration
├── hooks/
│   └── useTradingViewWidget.tsx
├── lib/
│   ├── constants.ts      # App constants & configs
│   └── utils.ts          # Utility functions
├── middleware/
│   └── index.ts          # Route protection
├── types/
│   └── global.d.ts       # TypeScript declarations
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB database


### Installation

#### 1. Clone the repository
```
bash
git clone <repository-url>
cd p1-realtime-stock-market
```
#### 2. Install dependencies
```
bash
npm install
```
#### 3. Start MongoDB with Docker
Navigate to the devops directory and start MongoDB + Mongo Express:
```
bash
cd devops/
docker-compose up -d
```
This will start:
- **MongoDB** on `mongodb://localhost:27017`
- **Mongo Express** (Web UI) on `http://localhost:8081`

#### 4. Set up environment variables
Create a `.env` file in the root directory:
```
env
# App
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/stock-market-db

# Better Auth
BETTER_AUTH_SECRET=your-random-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com

# Gemini (AI summaries)
GEMINI_API_KEY=your-google-gemini-key

# Inngest
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key
```
**📧 Gmail SMTP Setup:**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable **2-Step Verification**
3. Generate an **App Password**: Security → 2-Step Verification → App passwords
4. Use the generated 16-character password as `SMTP_PASSWORD`

**🤖 Gemini AI Setup:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Get API Key** or **Create API Key**
3. Copy the generated API key
4. Add it to your `.env` file as `GEMINI_API_KEY`

#### 5. Start Inngest Dev Server
Open a new terminal and run:
```
bash
npx inngest-cli@latest dev
```
This starts Inngest Dev Server on `http://localhost:8288`

#### 6. Run the development server
```
bash
npm run dev
```
#### 7. Access the application
Open your browser and navigate to:
- **Main App**: [http://localhost:3000](http://localhost:3000)
- **Mongo Express**: [http://localhost:8081](http://localhost:8081)
- **Inngest Dev UI**: [http://localhost:8288](http://localhost:8288)

### 🔗 Quick Access Links

| Service | URL | Description |
|---------|-----|-------------|
| **Main Application** | http://localhost:3000 | Stock market dashboard |
| **Sign In** | http://localhost:3000/sign-in | User login |
| **Sign Up** | http://localhost:3000/sign-up | User registration |
| **Mongo Express** | http://localhost:8081 | MongoDB admin interface |
| **Inngest Dev UI** | http://localhost:8288 | Background jobs dashboard |
| **API Health Check** | http://localhost:3000/api/debug/db | Database connection test |
## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check
- `npm run db:ping` - Test database connection

## 📱 Features Roadmap

- [ ] Advanced search functionality
- [ ] Custom watchlist management
- [ ] Price alerts and notifications
- [ ] Portfolio tracking
- [ ] News integration
- [ ] Social sentiment analysis
- [ ] Export data functionality

## 🙏 Acknowledgments

- [TradingView](https://www.tradingview.com/) for market data widgets
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Better Auth](https://www.better-auth.com/) for modern authentication solutions
- [Inngest](https://www.inngest.com/) for background jobs and workflow automation
- [Mongo Express](https://github.com/mongo-express/mongo-express) for MongoDB admin interface
- [Mongoose](https://mongoosejs.com/) for elegant MongoDB object modeling
- [Lucide](https://lucide.dev/) for beautiful and consistent icons
- [Google Gemini AI](https://ai.google.dev/) for intelligent content generation