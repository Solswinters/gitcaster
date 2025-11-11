# GitCaster - Developer Reputation Platform

Build your developer reputation profile by showcasing GitHub activity and onchain builder scores. Stand out to recruiters with comprehensive insights into your coding contributions.

## Features

- 🔐 **Web3 Authentication** - Connect wallet via Reown AppKit (email/social or wallet)
- 📊 **GitHub Integration** - Sync commits, PRs, repos, and contribution history
- 🏆 **Talent Protocol Score** - Display your onchain builder score and credentials
- 📈 **Activity Visualizations** - Beautiful charts and graphs of your coding activity
- 🌐 **Public Profiles** - Shareable profile URLs for recruiters and employers
- 📱 **Responsive Design** - Mobile-first, works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Authentication**: Reown AppKit, SIWE (Sign-In with Ethereum)
- **Blockchain**: Wagmi v2 + Viem
- **Database**: Prisma + PostgreSQL (Railway)
- **Styling**: Tailwind CSS
- **APIs**: 
  - GitHub REST & GraphQL API
  - Talent Protocol API
  - Reown/WalletConnect

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Railway)
- GitHub OAuth App
- Reown Project ID
- Talent Protocol API Key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Solswinters/gitcaster.git
cd gitcaster
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file with:

```env
DATABASE_URL=your_postgresql_url
SESSION_SECRET=your_session_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
TALENT_PROTOCOL_API_KEY=your_talent_protocol_api_key
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### For Developers

1. **Create Profile**: Click "Create Your Profile" on the homepage
2. **Connect Wallet**: Authenticate using Reown AppKit (wallet or email/social)
3. **Connect GitHub**: Authorize GitHub OAuth access
4. **Sync Data**: Provide a GitHub token to fetch your activity
5. **Share Profile**: Get your public profile URL to share with recruiters

### For Recruiters

1. Browse developer profiles without authentication
2. View comprehensive GitHub statistics
3. Check Talent Protocol builder scores
4. Access GitHub profiles and wallet addresses for outreach

## Project Structure

```
gitcaster/
├── src/
│   ├── app/                 # Next.js pages and API routes
│   ├── components/          # React components
│   ├── lib/                 # Utilities and integrations
│   │   ├── db/             # Prisma client
│   │   ├── github/         # GitHub API client
│   │   ├── talent-protocol/# Talent Protocol client
│   │   ├── reown/          # Reown AppKit config
│   │   └── session/        # Session management
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript types
├── prisma/                 # Database schema and migrations
└── public/                 # Static assets
```

## API Routes

- `/api/auth/*` - Authentication (SIWE, session management)
- `/api/github/callback` - GitHub OAuth callback
- `/api/sync` - Sync GitHub data
- `/api/sync/talent` - Sync Talent Protocol data
- `/api/profile/[slug]` - Get public profile data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Links

- [Live Demo](https://gitcaster.vercel.app) (coming soon)
- [GitHub Docs](https://docs.github.com/en)
- [Talent Protocol Docs](https://docs.talentprotocol.com/docs)
- [Reown Docs](https://docs.reown.com/)

## Support

For questions or issues, please open an issue on GitHub or reach out to the team.

---

Built with ❤️ for developers, by developers.
