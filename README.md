# BlogMe - Modern Developer Blog

A modern, professional blog built with Next.js 15, TypeScript, and Tailwind CSS. Features MDX support, dark mode, responsive design, and comprehensive SEO optimization.

## ✨ Features

### 🎨 Design & UX
- **Modern Design**: Clean, minimalist interface with cohesive color scheme
- **Responsive**: Mobile-first design that works on all devices
- **Dark Mode**: Seamless light/dark theme switching with system preference detection
- **Glassmorphism & Neumorphism**: Modern design effects for visual depth
- **Smooth Animations**: Subtle transitions and hover effects

### 📝 Content Management
- **MDX Support**: Write content in Markdown with React components
- **Table of Contents**: Auto-generated navigation for long articles
- **Reading Time**: Automatic calculation and display
- **Tag & Category System**: Organize content with dynamic routing
- **Featured Posts**: Highlight important articles

### 🔍 Search & Discovery
- **Full-Text Search**: Fast client-side search with Fuse.js
- **Tag Pages**: Browse articles by topic
- **Category Pages**: Organized content sections
- **Related Posts**: Smart content recommendations

### 🚀 Performance
- **Static Site Generation**: Pre-rendered pages for optimal performance
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic bundle optimization
- **Caching**: Smart caching strategies for API routes

### ♿ Accessibility
- **WCAG Compliant**: High contrast ratios and keyboard navigation
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Skip Links**: Quick navigation for keyboard users
- **Reduced Motion**: Respects user preferences

### 📊 SEO & Analytics
- **Dynamic Metadata**: Automatic meta tags and Open Graph
- **Structured Data**: JSON-LD for rich search results
- **Sitemap Generation**: Automatic XML sitemap
- **RSS Feed**: Subscribe to new content
- **Social Sharing**: Built-in sharing buttons

### 📖 Reading Experience
- **Reading Progress**: Visual progress indicator
- **Social Sharing**: Twitter, Facebook, LinkedIn integration
- **Copy Links**: Easy URL sharing
- **Print Friendly**: Optimized for printing

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX with next-mdx-remote
- **Search**: Fuse.js
- **Icons**: Lucide React
- **Fonts**: Inter, Merriweather, JetBrains Mono

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── blog/           # Blog pages
│   ├── tags/           # Tag pages
│   ├── category/       # Category pages
│   └── api/            # API routes
├── components/         # Reusable React components
├── lib/               # Utility functions
├── types/             # TypeScript type definitions
└── content/           # Blog posts (MDX files)
```

## ✍️ Writing Content

Create new blog posts in the `content/posts/` directory using MDX format:

```mdx
---
title: "Your Post Title"
description: "Brief description of your post"
date: "2024-01-15"
tags: ["Next.js", "React", "TypeScript"]
category: "Development"
author:
  name: "Your Name"
  bio: "Brief bio"
coverImage: "https://example.com/image.jpg"
featured: true
published: true
---

# Your Content Here

Write your content using Markdown syntax with React components.
```

## 🎨 Customization

### Colors & Theme
Modify the color scheme in `tailwind.config.ts`

### Typography
Update fonts in `src/app/layout.tsx` and `tailwind.config.ts`

### Site Metadata
Update site information in `src/app/layout.tsx` for SEO and social sharing

## 📱 Deployment

The blog is optimized for deployment on Vercel, Netlify, or any static hosting provider.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
