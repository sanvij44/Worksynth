# WorkSynth — AI Powered Freelance Execution System

![WorkSynth](https://img.shields.io/badge/WorkSynth-v0.1.0-6366F1?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss)

> A premium AI-powered freelance project management platform frontend.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
worksynth/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   └── AIPanel.jsx          # Floating AI assistant chat panel
│   │   ├── employer/
│   │   │   └── EmployerComponents.jsx  # Stats, projects grid, table, milestones
│   │   ├── freelancer/
│   │   │   └── FreelancerComponents.jsx # Earnings, tasks, reputation, chart
│   │   ├── landing/
│   │   │   ├── AIOrb.jsx            # React Three Fiber 3D orb
│   │   │   ├── Features.jsx         # Features grid section
│   │   │   ├── Hero.jsx             # Hero section
│   │   │   ├── HowItWorks.jsx       # 3-step section
│   │   │   └── LandingSections.jsx  # Stats, Testimonials, Pricing, CTA
│   │   ├── layout/
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── project/
│   │   │   └── ProjectComponents.jsx  # Timeline, upload, quality check, activity
│   │   └── ui/
│   │       ├── Badge.jsx
│   │       ├── GlassCard.jsx
│   │       ├── GradientButton.jsx
│   │       ├── ProgressBar.jsx
│   │       └── StarRating.jsx
│   ├── context/
│   │   ├── AppContext.jsx            # AI panel state
│   │   └── ThemeContext.jsx          # Dark / light mode
│   ├── data/
│   │   ├── index.js                  # Freelancers, testimonials, pricing, AI replies
│   │   └── projects.js               # Projects & employer stats
│   ├── hooks/
│   │   ├── useAnimatedCounter.js
│   │   └── useInView.js
│   ├── pages/
│   │   ├── EmployerDashboard.jsx
│   │   ├── FreelancerDashboard.jsx
│   │   ├── Landing.jsx
│   │   └── ProjectDetail.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#6366F1` | Buttons, highlights, active states |
| `secondary` | `#8B5CF6` | Gradients, accents |
| `accent` | `#06B6D4` | AI features, quality scores |
| `bg-dark` | `#0F172A` | Dark mode background |
| `bg-light` | `#F8FAFC` | Light mode background |
| `card-dark` | `#111827` | Dark mode cards |

**Fonts:** Syne (display headings) · DM Sans (body text)

---

## 📄 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero + 3D orb + features + pricing |
| `/login` | Login | Split-screen with branding panel + email/social login |
| `/signup` | Signup | 2-step role selection + profile details with password strength |
| `/employer` | EmployerDashboard | 5-tab dashboard: overview, projects, freelancers, escrow, analytics |
| `/freelancer` | FreelancerDashboard | Earnings, tasks, reputation, charts |
| `/project/:id` | ProjectDetail | Milestone timeline, submission upload, AI quality check |

---

## ✨ Features

- **React Three Fiber** 3D animated orb on hero (with CSS fallback)
- **Framer Motion** page transitions, stagger animations, hover micro-interactions
- **Dark / Light mode** toggle with persistent context
- **Floating AI Assistant** panel with typing indicators and smart replies
- **Glassmorphism** cards with backdrop blur
- **Animated progress bars** triggered on scroll via IntersectionObserver
- **Animated SVG** reputation score circle
- **Milestone timeline** with status-aware styling
- **File upload UI** with drag-and-drop feedback
- **Fully responsive** — mobile sidebar hidden, tab nav on mobile dashboards

---

## 🛠 Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| React | 18 | UI framework |
| React Router DOM | 6 | Client-side routing |
| Vite | 5 | Build tool |
| TailwindCSS | 3 | Utility-first styling |
| Framer Motion | 10 | Animations |
| @react-three/fiber | 8 | WebGL / 3D rendering |
| @react-three/drei | 9 | R3F helpers (Float, Stars, etc.) |
| Three.js | 0.159 | 3D engine |
| Lucide React | 0.303 | Icon library |
