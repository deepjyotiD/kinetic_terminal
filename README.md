<div align="center">
  <img src="public/favicon.ico" alt="Kinetic Terminal Logo" width="80" height="80">
  <h1 align="center">Kinetic Terminal</h1>
  <p align="center">
    <strong>Visualizing the Human Side of Source Code.</strong>
  </p>
</div>

<br />

**Kinetic Terminal** is a high-performance GitHub visualizer built to transform raw developer data into a compelling, interactive narrative. Breaking away from traditional dashboards, Kinetic Terminal utilizes a sleek, dark-mode "hacker" UI inspired by modern IDEs, complete with glowing bento-grid layouts, fluid scroll animations, and premium terminal-style aesthetics.

Whether you're a recruiter analyzing technical talent or a developer showing off a massive commit history, Kinetic Terminal delivers an immersive, data-rich experience that finally uncovers the human side of source code.

---

## ✨ Features

- **🌐 Deep API Telemetry**: Securely fetches data using both GitHub REST and GraphQL APIs for the most accurate and up-to-date repository analysis.
- **🛡️ Next-Gen Authentication**: Leveraging Clerk for robust, seamless sign-in UI and secure session middleware.
- **📈 52-Week Heatmaps**: Dynamic, real-time visualization of developer contribution graphs and commit consistency.
- **🎨 Premium Hacker Aesthetic**: Styled with Tailwind CSS v4, utilizing "Tonal Stacking," intersection observers for scroll animations, and glowing bento grids.
- **🔍 SEO & Link Unfurling**: Pre-rendered dynamic OpenGraph metadata via Next.js layouts for beautiful rich-link social sharing.
- **🚀 Advanced Frontend Architecture**: Animated loading skeletons, graceful API error boundaries, empty-state intelligence, and edge-ready caching.

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Data Source**: [GitHub REST API v3](https://docs.github.com/en/rest) & [GraphQL API v4](https://docs.github.com/en/graphql)

## 💻 Running Locally

To run Kinetic Terminal locally, you'll need Node.js and two specific environment keys to authenticate the application.

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/kinetic-terminal.git
cd kinetic-terminal

# Install dependencies
npm install
```

### 2. Environment Variables
Create a local `.env.local` file at the root of the project to securely house your keys:
```env
# GitHub Personal Access Token (Sign in to GitHub -> Developer Settings -> Tokens)
GITHUB_TOKEN=your_github_token_here

# Clerk API Keys (Sign in to Clerk -> Dashboard -> Create Application)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```
> **Note:** Generating a GitHub Personal Access Token (classic) increases your GitHub API rate limit from 60 to 5,000 requests per hour, preventing unexpected rendering errors. 

### 3. Spin Up the Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to begin analyzing!

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
