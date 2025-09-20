# Prompt Platform

A comprehensive prompt database platform built with Next.js, TypeScript, and Supabase. Discover, save, and share AI prompts for text, image, and video generation.

## ✨ Features

- 🔍 **Advanced Search & Filtering** - Find prompts by category, platform, tags, and content
- 👍 **Voting System** - Upvote/downvote prompts to surface the best content
- 📚 **Save Collections** - Save your favorite prompts to organized collections
- 🎯 **Category Organization** - Browse prompts by coding, marketing, design, and more
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile
- 🔐 **Whop Authentication** - Secure login with your Whop account
- ⚡ **Real-time Updates** - Live vote counts and engagement metrics

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Authentication**: Whop OAuth integration
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- Whop developer account

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `scripts/schema.sql`
   - Run the sample data from `scripts/sample-data.sql` (optional)

3. **Configure environment variables**
   Your `.env.local` is already configured with Supabase credentials.
   Add your Whop API key:
   ```bash
   WHOP_API_KEY=your_actual_whop_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Main application routes
│   ├── api/               # API endpoints
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── prompts/          # Prompt-related components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and configurations
│   ├── supabase/         # Supabase client and queries
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
├── scripts/              # Database scripts
└── public/               # Static assets
```

## 🎯 Navigation Tabs

- **Text Prompts**: ChatGPT, Claude, and other LLM prompts ✅
- **Image Prompts**: Midjourney, DALL-E, Stable Diffusion prompts ✅
- **Video Prompts**: Coming soon (Runway, Pika Labs) 🔄
- **Prompt Testing**: Coming soon (OpenRouter integration) 🔄
- **Agent Rooms**: Coming soon (Collaborative AI workspaces) 🔄

## 📊 Database Setup

Run these SQL scripts in your Supabase SQL editor:

1. **Main Schema**: `scripts/schema.sql`
2. **Sample Data**: `scripts/sample-data.sql`

## 🔑 Environment Variables

```bash
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://yzdpjgxdxnirkrikxcnz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[configured]
SUPABASE_SERVICE_ROLE_KEY=[configured]

# Whop OAuth (configured with your credentials)
WHOP_API_KEY=your_whop_api_key_here
NEXT_PUBLIC_WHOP_APP_ID=app_nvrJ2k2vDsNYvg
NEXT_PUBLIC_WHOP_AGENT_USER_ID=user_S8LPdbgQDySPy
NEXT_PUBLIC_WHOP_COMPANY_ID=biz_TL66Q5P2766ocX

# OpenAI (optional)
OPENAI_API_KEY=your_openai_api_key_here
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy!

## 🎨 Built With

- Next.js 15.3.4 with App Router
- React 19.0.0
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui components
- Supabase for backend
- Whop for authentication

---

🎉 **Your prompt platform is ready to launch!** Start by running the database scripts and testing the authentication flow.
