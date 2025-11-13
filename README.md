# GitCaster - Developer Reputation Platform

Build your developer reputation profile by showcasing GitHub activity and onchain builder scores. Stand out to recruiters with comprehensive insights into your coding contributions and blockchain credentials.

## ✨ Features

### For Developers

- 🔐 **Flexible Web3 Authentication**
  - Connect with any wallet (MetaMask, WalletConnect, etc.)
  - Email and social logins (Google, GitHub, Apple, Facebook, X, Discord)
  - Smart contract wallet support via Reown AppKit
  - SIWE (Sign-In with Ethereum) for EOA wallets

- 📊 **Comprehensive GitHub Integration**
  - One-time OAuth setup with automatic token storage
  - Sync all repositories, commits, PRs, and issues
  - Programming language statistics
  - Contribution graphs and activity timeline
  - Top repositories showcase
  - Real-time data refresh on demand

- 🏆 **Talent Protocol Integration**
  - Display onchain builder score (optional)
  - Showcase blockchain credentials
  - Link to Talent Protocol passports

- 🎨 **Beautiful Resume-Style Profiles**
  - Professional layout optimized for recruiters
  - Tabbed interface: Overview, Stats, Projects
  - Skill badges and language proficiency
  - Project gallery with descriptions
  - Social links and contact information
  - Shareable public profile URLs

- 📱 **Fully Responsive**
  - Mobile-first design
  - Works seamlessly on all devices
  - Optimized for sharing on social media

### For Recruiters

- 🔍 **Discover Developer Talent**
  - View public profiles without authentication
  - Comprehensive GitHub statistics at a glance
  - Onchain reputation scores
  - Direct links to GitHub profiles
  - Easy-to-share profile URLs

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

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL database** - [Railway](https://railway.app/) (recommended) or local instance
- **GitHub OAuth App** - [Create one](https://github.com/settings/developers)
- **Reown Project ID** - [Get one](https://cloud.reown.com/)
- **Talent Protocol API Key** (optional) - [Request access](https://talentprotocol.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Solswinters/gitcaster.git
cd gitcaster
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: `GitCaster Local Dev`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/github/callback`
4. Click **"Register application"**
5. Copy your **Client ID** and **Client Secret**

### Step 4: Set Up Reown Project

1. Go to [Reown Cloud](https://cloud.reown.com/)
2. Create a new project
3. Copy your **Project ID**

### Step 5: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Session (generate a random string)
SESSION_SECRET="your-secure-random-string-here"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Reown/WalletConnect
NEXT_PUBLIC_REOWN_PROJECT_ID="your_reown_project_id"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Talent Protocol (optional)
TALENT_PROTOCOL_API_KEY="your_talent_protocol_api_key"
```

**To generate a secure SESSION_SECRET:**
```bash
openssl rand -base64 32
```

### Step 6: Set Up Database

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### Step 7: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

### Step 8: Create Your First Profile

1. Click **"Create Your Profile"**
2. Connect your wallet (or use email/social login)
3. Connect your GitHub account
4. Your GitHub token is automatically saved (no need to re-enter!)
5. Sync your data and view your profile

## 📖 Usage Guide

### Creating Your Profile

**1. Authentication**
- Visit the homepage and click **"Create Your Profile"**
- Choose your authentication method:
  - **Wallet**: MetaMask, WalletConnect, Coinbase Wallet, etc.
  - **Email**: Sign up with any email address
  - **Social**: Google, GitHub, Apple, Facebook, X, or Discord

**2. GitHub Connection**
- Click **"Connect GitHub"** when prompted
- Authorize GitCaster to read your public GitHub data
- Your OAuth token is automatically saved for future syncs

**3. Data Sync (First Time Only)**
- For initial setup, you'll need a GitHub Personal Access Token
- Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
- Click **"Generate new token (classic)"**
- Select scopes: `repo`, `read:user`, `read:org`
- Copy the token and paste it in GitCaster
- **This is a one-time setup** - the token is saved securely

**4. View Your Profile**
- Your profile is automatically generated
- Access it via `/profile/your-username`
- Share this URL with recruiters and on social media

**5. Refresh Data**
- Visit your dashboard anytime
- Click **"Refresh Data"** to update your stats
- No need to re-enter your GitHub token!

### For Recruiters

**Finding Talent**
- Browse developer profiles via shared links
- No authentication required to view profiles
- See comprehensive GitHub statistics
- Check onchain credentials via Talent Protocol
- Contact developers directly via their GitHub profile

### Dashboard Features

**Profile Management**
- View profile statistics
- Track profile views (coming soon)
- Refresh GitHub data
- Copy shareable profile link
- Quick links to GitHub and personal profile

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

## 🔌 API Routes

### Authentication
- `POST /api/auth/nonce` - Generate SIWE nonce
- `POST /api/auth/verify` - Verify SIWE signature or smart wallet address
- `GET /api/auth/session` - Get current session
- `POST /api/auth/logout` - Logout and clear session

### GitHub Integration
- `GET /api/github/callback` - OAuth callback handler
- `POST /api/sync` - Sync GitHub data (uses stored token)

### Talent Protocol
- `POST /api/sync/talent` - Sync Talent Protocol data

### Profiles
- `GET /api/profile/[slug]` - Get public profile data

## 🐛 Troubleshooting

### Common Issues

**1. GitHub OAuth Redirect Error**

```
Error: The redirect_uri is not associated with this application
```

**Solution:**
- Go to your GitHub OAuth app settings
- Ensure the **Authorization callback URL** is exactly: `http://localhost:3000/api/github/callback`
- Match the port number if running on a different port

---

**2. Prisma Client Errors After Schema Changes**

```
Error: Unknown field 'fieldName' for select statement
```

**Solution:**
```bash
# Regenerate Prisma client
npx prisma generate

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

---

**3. Smart Wallet Authentication Errors**

```
TypeError: invalid raw signature length
```

**Solution:**
- This is expected for email/social logins (smart wallets)
- The app automatically detects and handles smart wallets
- No action needed - authentication should complete successfully

---

**4. Database Connection Errors**

```
Error: Can't reach database server
```

**Solution:**
- Check your `DATABASE_URL` in `.env.local`
- Ensure your PostgreSQL instance is running
- For Railway: verify the connection string is current
- Test connection: `npx prisma db pull`

---

**5. Session/Cookie Issues**

```
Error: Session data is invalid
```

**Solution:**
```bash
# Clear browser cookies for localhost:3000
# Restart dev server
npm run dev
```

---

**6. Talent Protocol 404 Errors**

```
Error: Resource not found (404)
```

**Solution:**
- This is normal if you don't have a Talent Protocol passport
- Talent Protocol is optional - profile works without it
- Create passport at: https://talentprotocol.com

### Development Tips

**Hot Reload Issues**
- If changes aren't reflecting, restart the dev server
- Clear `.next` cache: `rm -rf .next`

**TypeScript Errors**
- Run `npm run type-check` to see all TypeScript errors
- Regenerate Prisma types: `npx prisma generate`

**Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

### Quick Start

```bash
# Clone and setup
git clone https://github.com/Solswinters/gitcaster.git
cd gitcaster
./scripts/setup-dev.sh

# Start developing
npm run dev
```

### Development Guidelines

- Follow [Contributing Guidelines](CONTRIBUTING.md)
- Use [Conventional Commits](https://www.conventionalcommits.org/)
- Write tests for new features
- Follow TypeScript best practices
- Use NativeWind (Tailwind) for styling
- Keep files under 500 lines

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 🔒 Security

### Token Storage
- GitHub OAuth tokens are stored securely in PostgreSQL
- Tokens are never exposed to the client
- All API requests use server-side token retrieval

### Authentication
- SIWE (Sign-In with Ethereum) for wallet authentication
- Iron-session for encrypted session management
- Support for both EOA and smart contract wallets

### Best Practices
- Always use HTTPS in production
- Rotate GitHub tokens periodically
- Keep dependencies updated: `npm audit`
- Use environment variables for all secrets

## 🚀 Deployment

### Deploying to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Set Environment Variables**
   - Add all variables from `.env.local` in Vercel dashboard
   - Don't forget to update `NEXT_PUBLIC_APP_URL` to your Vercel domain

4. **Update GitHub OAuth**
   - Add your Vercel domain to authorized redirect URLs
   - `https://yourdomain.vercel.app/api/github/callback`

5. **Deploy**
   - Vercel automatically deploys on every push to main
   - Preview deployments for pull requests

### Database Considerations
- Use a production PostgreSQL instance (Railway, Supabase, Neon)
- Run migrations in production: `npx prisma migrate deploy`
- Set up database backups

## 📊 Features Roadmap

- [ ] Profile customization (themes, layouts)
- [ ] Profile view analytics
- [ ] Search and discover developers
- [ ] Team/organization profiles
- [ ] Export profile as PDF
- [ ] Integration with more platforms (GitLab, Bitbucket)
- [ ] Advanced contribution analytics
- [ ] Profile badges and achievements
- [ ] Social sharing optimizations (OG images)

## 📚 Resources & Documentation

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub REST API](https://docs.github.com/en/rest)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [Talent Protocol API](https://docs.talentprotocol.com/docs)
- [Reown AppKit](https://docs.reown.com/appkit/overview)
- [Wagmi Documentation](https://wagmi.sh/)
- [Prisma Documentation](https://www.prisma.io/docs)

### Community
- [GitHub Issues](https://github.com/Solswinters/gitcaster/issues) - Report bugs
- [GitHub Discussions](https://github.com/Solswinters/gitcaster/discussions) - Ask questions
- [Twitter](https://twitter.com/) - Follow for updates

## 📜 License

MIT License - feel free to use this project for your own purposes.

See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication powered by [Reown](https://reown.com/)
- Blockchain data via [Talent Protocol](https://talentprotocol.com/)
- Hosted on [Vercel](https://vercel.com/)
- Database hosted on [Railway](https://railway.app/)

## 📧 Support

Have questions or need help?

- 📖 Check the [Troubleshooting](#-troubleshooting) section
- 🐛 [Open an issue](https://github.com/Solswinters/gitcaster/issues) for bugs
- 💬 Start a [discussion](https://github.com/Solswinters/gitcaster/discussions) for questions
- 📧 Email: support@gitcaster.dev (coming soon)

---

<div align="center">

**Built with ❤️ for developers, by developers**

[Website](https://gitcaster.vercel.app) • [Documentation](https://github.com/Solswinters/gitcaster) • [Issues](https://github.com/Solswinters/gitcaster/issues)

</div>
