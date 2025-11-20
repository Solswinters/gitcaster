# GitCaster

A powerful platform for developers to showcase their GitHub presence and connect with the blockchain ecosystem using Talent Protocol integration.

## Features

- 🔐 **Secure Authentication** - Sign in with Ethereum (SIWE) and GitHub OAuth
- 📊 **Analytics Dashboard** - Comprehensive insights into your GitHub activity
- 🔍 **Developer Discovery** - Find and connect with talented developers
- 🏆 **Talent Protocol Integration** - Showcase your builder score and credentials
- ⚡ **Real-time Sync** - Automatic synchronization with GitHub
- 🎨 **Modern UI** - Beautiful, responsive interface built with Next.js 14 and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with NativeWind
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Reown AppKit + SIWE
- **Blockchain**: Wagmi v2 + Viem
- **Smart Contracts**: Solidity on Base Network
- **Testing**: Jest, React Testing Library, Playwright
- **APIs**: GitHub REST & GraphQL, Talent Protocol

## Smart Contract

GitCaster uses an on-chain NFT system for developer achievements and credentials.

### DeveloperProfileNFT Contract

**Network**: Base (Chain ID: 8453)  
**Contract Address**: `0x28c783CF53ae745936741869ad3258E1c0cF5B60`  
**Block Explorer**: [View on BaseScan](https://basescan.org/address/0x28c783CF53ae745936741869ad3258E1c0cF5B60)

**Features**:
- 🏅 **Achievement Badges** - Mint NFTs for GitHub milestones (commits, repos, stars, etc.)
- 🔗 **GitHub Linking** - Link GitHub usernames to Ethereum addresses on-chain
- 🎯 **Talent Protocol Integration** - Store and verify builder scores
- 🔒 **Soulbound Tokens** - Non-transferable credentials for verified achievements
- 📦 **Batch Minting** - Efficiently mint multiple achievements at once

**Achievement Types**:
- `COMMITS_100` - 100 commits milestone
- `COMMITS_1000` - 1,000 commits milestone
- `REPOS_10` - 10 repositories created
- `REPOS_50` - 50 repositories created
- `STARS_100` - 100 stars received
- `STARS_1000` - 1,000 stars received
- `CONTRIBUTOR_10` - Contributed to 10 projects
- `CONTRIBUTOR_50` - Contributed to 50 projects
- `TALENT_VERIFIED` - Talent Protocol verified
- `EARLY_ADOPTER` - Early GitCaster user
- `BUILDER_SCORE_HIGH` - High Talent Protocol builder score

**Usage**:
```typescript
import { DEVELOPER_PROFILE_NFT_ADDRESS, DEVELOPER_PROFILE_NFT_ABI } from './abi';

// Use with wagmi/viem to interact with the contract
```

See [`abi.ts`](./abi.ts) for the complete contract ABI and configuration.

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- GitHub OAuth App credentials
- Reown AppKit project ID

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gitcaster.git
cd gitcaster
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- `DATABASE_URL` - PostgreSQL connection string
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials
- `NEXT_PUBLIC_PROJECT_ID` - Reown AppKit project ID
- `TALENT_PROTOCOL_API_KEY` - Talent Protocol API key
- `NEXTAUTH_SECRET` - Random secret for NextAuth

4. Set up the database:
```bash
npm run db:push
npm run db:generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
gitcaster/
├── src/
│   ├── app/              # Next.js 14 App Router pages
│   ├── features/         # Feature modules
│   │   ├── auth/         # Authentication feature
│   │   ├── analytics/    # Analytics feature
│   │   ├── profile/      # User profiles
│   │   ├── github/       # GitHub integration
│   │   ├── search/       # Search & discovery
│   │   ├── collaboration/# Team collaboration
│   │   └── notifications/# Notifications
│   ├── shared/           # Shared resources
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   ├── types/        # TypeScript types
│   │   ├── services/     # API services
│   │   └── contexts/     # React contexts
│   └── lib/              # Core infrastructure
├── contracts/            # Smart contracts
│   └── DeveloperProfileNFT.sol
├── abi.ts                # Contract ABI and configuration
├── tests/                # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── docs/                 # Documentation
└── prisma/               # Database schema

```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage
- `npm run test:e2e` - Run E2E tests
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## Documentation

- [Architecture Guide](./ARCHITECTURE.md) - System architecture and design decisions
- [API Documentation](./docs/API.md) - API endpoints and usage
- [Testing Guide](./docs/TESTING.md) - Testing strategies and examples
- [Smart Contract](./contracts/DeveloperProfileNFT.sol) - On-chain achievement NFT contract
- [Contract ABI](./abi.ts) - Contract ABI and configuration for frontend integration
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deployment instructions
- [Changelog](./docs/CHANGELOG.md) - Version history
- [Roadmap](./docs/ROADMAP.md) - Future plans
- [Security Policy](./docs/SECURITY.md) - Security practices

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- [Talent Protocol](https://talentprotocol.com/) - For builder credentials
- [Reown](https://reown.com/) - For wallet connection
- [Next.js](https://nextjs.org/) - For the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework

## Support

- 📧 Email: support@gitcaster.example.com
- 💬 Discord: [Join our community](https://discord.gg/gitcaster)
- 🐦 Twitter: [@gitcaster](https://twitter.com/gitcaster)
- 📝 Issues: [GitHub Issues](https://github.com/yourusername/gitcaster/issues)

---

Made with ❤️ by the GitCaster team
