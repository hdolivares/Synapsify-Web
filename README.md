# Synapsify-Web

A modern, high-performance landing page for Synapsify - an AI co-developer for Unreal Engine.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main landing page
│   └── globals.css     # Global styles with Tailwind
├── components/
│   ├── Navbar.tsx      # Sticky navigation bar
│   ├── Hero.tsx        # Hero section with main headline
│   ├── Problem.tsx     # Problem section
│   ├── Solution.tsx    # Solution section with before/after visual
│   ├── Features.tsx    # 3-column feature grid
│   ├── HowItWorks.tsx  # Step-by-step visual guide
│   ├── Roadmap.tsx     # Project status timeline
│   └── CallToAction.tsx # Final CTA section
└── package.json        # Dependencies and scripts
```

## Features

- **Dark Mode Theme:** Optimized for developer tools
- **Scroll-Based Animations:** Sections fade in and slide up as you scroll
- **Responsive Design:** Works seamlessly on all device sizes
- **Performance Optimized:** Built with Next.js for optimal loading speeds
- **Interactive Elements:** Hover effects and smooth transitions
