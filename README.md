# 🎙️ Podcast Hub

A simple **Next.js + Tailwind** project to discover podcasts.

Deployement Links:
- Frontend : https://podcast-hub-seven.vercel.app
- Backend : https://podcast-hub-jy1r.onrender.com
- Discord link: https://discord.gg/sWMYzxsE

## 🏗️ Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend
- Node.js
- Express.js
- MongoDB

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or later
- MongoDB installed locally or MongoDB Atlas account
- Git

### Clone the Repository
```bash
git clone https://github.com/yourusername/podcast-hub.git
cd podcast-hub
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000`

### Backend Setup
```bash
cd Backend
npm install
# Create .env file with required environment variables
cp .env.example .env
# Start the development server
npm start
```
The backend API will be available at `http://localhost:5000`

## 🛠️ Development Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Backend
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## 📝 Environment Variables

### Frontend
Create `.env.local` file in the Frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend
Create `.env` file in the Backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/podcast-hub
```

## Stats

[![Total Commits](https://img.shields.io/badge/Commits-143%2B-blue?style=for-the-badge)](https://github.com/cryptohub53/podcast-hub/commits)
[![Contributors](https://img.shields.io/badge/Contributors-1-blueviolet?style=for-the-badge)](https://github.com/cryptohub53/podcast-hub/graphs/contributors)
[![PRs Merged](https://img.shields.io/github/issues-pr-closed/skully-coder/shiksha-ai?style=for-the-badge&color=success)](https://github.com/cryptohub53/podcast-hub/pulls?q=is%3Apr+is%3Amerged)
[![Issues Resolved](https://img.shields.io/badge/Issues%20Resolved-2-orange?style=for-the-badge)](https://github.com/cryptohub53/podcast-hub/issues?q=is%3Aissue+is%3Aclosed)
[![GitHub Stars](https://img.shields.io/github/stars/skully-coder/shiksha-ai?style=for-the-badge&color=yellow)](https://github.com/cryptohub53/podcast-hub/stargazers)
[![Hacktoberfest Participation](https://img.shields.io/badge/Hacktoberfest-2025-blueviolet?style=for-the-badge&logo=hacktoberfest)](https://hacktoberfest.com)


