# WriteFlow - AI-Powered Content Creation Platform

WriteFlow is a sophisticated SaaS platform that leverages artificial intelligence to streamline and enhance the content creation process for marketers, writers, and content creators. Built with Next.js, Prisma, and modern web technologies, WriteFlow offers an intuitive interface for generating, optimizing, and managing content at scale.

![WriteFlow Banner](public/banner.png)

## 🌟 Features

### AI-Driven Content Creation
- **Smart Brainstorming:** Generate creative ideas and outlines based on your topics
- **Automated Draft Generation:** Create initial content drafts with AI assistance
- **Content Optimization:** Enhance readability, SEO, and engagement
- **Multi-Format Support:** Create blog posts, social media content, ad copy, and more

### Advanced Editing & Management
- **Rich Text Editor:** Professional WYSIWYG editor with formatting tools
- **Version Control:** Track changes and maintain content history
- **Project Organization:** Manage multiple content projects efficiently
- **Real-time Collaboration:** Work together with team members seamlessly

### Analytics & Optimization
- **Performance Tracking:** Monitor content metrics and engagement
- **SEO Tools:** Built-in optimization suggestions and keyword analysis
- **Usage Analytics:** Track AI usage and content generation statistics

### Integrations
- **WordPress Publishing:** Directly publish content to your WordPress site
- **Social Media Integration:** Share content across platforms
- **Email Export:** Send content via integrated email tools

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or later
- PostgreSQL database (or use the provided Neon DB connection)
- Groq API key (for AI capabilities)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/writeflow.git
cd writeflow
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
# Database
DATABASE_URL="your-postgresql-connection-string"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# AI API
GROQ_API_KEY="your-groq-api-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="WriteFlow"
```

4. Initialize the database:
```bash
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TailwindCSS, Framer Motion
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js
- **AI Integration:** Groq API (LLaMa 3.3)
- **Deployment:** Vercel

## 📝 Project Structure

- `/app` - Next.js App Router components and pages
- `/app/api` - API routes for backend functionality
- `/app/components` - Reusable UI components
- `/app/lib` - Utility functions and services
- `/prisma` - Database schema and migrations

## 🧩 Key Components

- **Dashboard:** Central hub for managing content projects
- **Editor:** Advanced WYSIWYG editor with AI assistance
- **Project Management:** Create, organize and track content projects
- **Analytics:** Track performance and usage metrics
- **Settings:** Configure account and integration settings

## 🔐 Security Features

- Secure authentication with NextAuth.js
- API key management for integrations
- XSS protection headers
- CSRF protection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [Groq](https://groq.com/)
- [Vercel](https://vercel.com/)

## 📚 Documentation

For detailed documentation, visit our [Documentation Page](https://docs.writeflow.com) covering:
- Complete API reference
- Integration guides
- Best practices
- Troubleshooting
- User guides

## 🛠 Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js
- **AI Integration:** OpenAI GPT
- **Deployment:** Vercel

## 🔒 Security

WriteFlow takes security seriously:
- End-to-end encryption for sensitive data
- Two-factor authentication support
- Regular security audits
- GDPR and CCPA compliant
- Rate limiting and abuse prevention

## ⭐ Star Us!

If you find WriteFlow helpful, please star our repository! It helps us reach more developers and content creators.

---

Built with ❤️ by the WriteFlow Team
