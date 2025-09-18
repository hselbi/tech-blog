# 🚀 Tech Blog - Multi-Brand Developer Platform

A powerful, modern tech blog platform with **instant brand switching**, user authentication, Notion CMS integration, and comprehensive admin features. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Key Features

### 🎨 **6 Tech-Focused Brand Options**
Switch your entire blog identity instantly with one line of code:
- **CodeCraft** 🛠️ - "Crafting Code & Content" (Blue/Purple theme)
- **DevFlow** ⚡ - "Developer Workflow & Insights" (Emerald/Cyan theme)
- **TechPulse** 📡 - "Stay Current, Stay Ahead" (Red/Orange theme)
- **CodeCanvas** 🎨 - "Where Code Meets Creativity" (Amber/Pink theme)
- **ByteStream** 🌊 - "Continuous Flow of Knowledge" (Sky/Blue theme)
- **StackShare** 📚 - "Sharing Development Stacks" (Indigo/Violet theme)

### 🔐 **Complete Authentication System**
- **NextAuth.js integration** with multiple providers
- **Email/password authentication** with secure password hashing
- **OAuth support** for Google and GitHub
- **User registration** with automatic database creation
- **Session management** and protected routes

### 📊 **Admin Dashboard & User Management**
- **Comprehensive admin panel** with user statistics
- **Real-time user monitoring** and login tracking
- **User analytics** - registration dates, login counts, activity
- **Database management** for all users
- **Email notification system** for admin alerts

### 🗄️ **Notion CMS Integration**
- **Personal databases** for each user
- **Template-based database creation**
- **User-specific content management**
- **Content aggregation** from multiple user databases
- **Rich text editing** with Tiptap editor
- **Auto-sync** between editor and Notion

### 🎯 **Modern Design & UX**
- **Responsive design** that works on all devices
- **Dark mode** with system preference detection
- **Smooth animations** and modern UI components
- **Accessible** with WCAG compliance
- **Fast loading** with optimized performance

### 🔍 **Advanced Content Features**
- **Full-text search** across all content
- **Tag and category system**
- **Featured posts** and content curation
- **Reading progress** indicators
- **Social sharing** integration
- **SEO optimized** with meta tags and structured data

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **CMS**: Notion API
- **Editor**: Tiptap (rich text)
- **Database**: Notion (user-specific databases)
- **Deployment**: Vercel-ready
- **Icons**: Lucide React

## 🚀 Quick Start

### 1. **Clone & Install**
```bash
git clone https://github.com/hselbi/tech-blog.git
cd tech-blog
npm install
```

### 2. **Environment Setup**
Create `.env.local`:
```bash
# Notion Integration
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID=your_template_database_id
NOTION_PARENT_PAGE_ID=your_parent_page_id
ENABLE_NOTION_CMS=true

# NextAuth Configuration
NEXTAUTH_SECRET=your_super_secret_key
NEXTAUTH_URL=http://localhost:3000

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 3. **Choose Your Brand**
In `/src/config/brand.ts`:
```typescript
export const CURRENT_BRAND = 'codecraft' // or any other option!
```

### 4. **Start Development**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🎨 Brand Switching

Change your entire blog in seconds:

```typescript
// In /src/config/brand.ts
export const CURRENT_BRAND = 'devflow' // Switch to DevFlow theme
```

**What changes instantly:**
- ✅ Brand name and taglines
- ✅ Logo and color scheme
- ✅ SEO metadata and titles
- ✅ Hero sections and descriptions
- ✅ Social media previews

## 👥 User Management

### **Admin Access**
- Login with: `test@admin.com` / `admin123`
- Access admin dashboard at `/admin`
- View all users, stats, and manage content

### **User Features**
- **Registration**: Automatic personal database creation
- **Dashboard**: Personal content management at `/dashboard`
- **Writing**: Rich text editor at `/write`
- **Profile**: Database status and management

## 📝 Content Management

### **For Users**
1. **Register/Login** to get your personal Notion database
2. **Write articles** using the built-in rich text editor
3. **Publish or save as drafts**
4. **Manage content** from your personal dashboard

### **For Admins**
- **Monitor all users** and their content
- **View analytics** and usage statistics
- **Send notifications** and manage the platform

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   ├── auth/              # Authentication pages
│   ├── blog/              # Public blog pages
│   ├── write/             # Content editor
│   └── api/               # API routes
├── components/            # Reusable components
├── config/                # Brand configuration
│   └── brand.ts          # 🎨 Brand switcher
├── lib/                   # Core functionality
│   ├── auth.ts           # Authentication logic
│   ├── notion.ts         # Notion API integration
│   ├── user-notion.ts    # User database management
│   └── blog-service.ts   # Content aggregation
└── types/                 # TypeScript definitions
```

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### **Environment Variables for Production**
```bash
NOTION_TOKEN=your_production_token
NOTION_DATABASE_ID=your_template_database
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://yourdomain.com
# + OAuth credentials if using
```

### **Update Domain References**
In `/src/app/layout.tsx`, update:
```typescript
metadataBase: new URL("https://yourdomain.com")
```

## 🎯 Features in Detail

### **Brand System**
- **6 pre-designed tech brands** with unique identities
- **Instant switching** - change one variable, transform everything
- **Consistent theming** across all components
- **SEO optimized** for each brand identity

### **Authentication**
- **Secure password hashing** with bcryptjs
- **OAuth integration** with Google/GitHub
- **Session management** with NextAuth.js
- **Protected routes** and middleware

### **Notion Integration**
- **Personal databases** for each user
- **Template replication** for consistency
- **Rich content editing** with Tiptap
- **Content aggregation** for public blog

### **Admin Features**
- **User analytics** and monitoring
- **Database management**
- **Email notifications** (extendable)
- **Content moderation** capabilities

## 🔧 Customization

### **Adding New Brands**
Add to `/src/config/brand.ts`:
```typescript
yourbrand: {
  name: "YourBrand",
  tagline: "Your Tagline",
  description: "Your description...",
  logo: { text: "YB", icon: "🚀" },
  colors: { primary: "#color", accent: "#color", gradient: "..." }
}
```

### **Extending Features**
- **Email integration**: Replace mock functions with real email service
- **Database upgrade**: Switch from in-memory to persistent database
- **Content types**: Add new content types and schemas
- **Analytics**: Integrate with Google Analytics or similar

## 📊 Analytics & Monitoring

- **User registration** and login tracking
- **Content creation** metrics
- **Database usage** monitoring
- **Admin dashboard** with real-time stats

## 🔒 Security Features

- **No API tokens** committed to repository
- **Environment variable** protection
- **Secure authentication** with NextAuth.js
- **HTTPS enforcement** in production
- **Input validation** and sanitization

## 🌟 What Makes This Special

1. **6 Brands in 1**: Instant identity switching for different niches
2. **Complete Platform**: Not just a blog, but a user management system
3. **Notion-Powered**: Leverage Notion's powerful CMS capabilities
4. **User-Centric**: Each user gets their own database and management
5. **Admin-Ready**: Full dashboard for platform management
6. **Production-Ready**: Secure, scalable, and deployment-optimized

## 📚 Documentation

- **Brand Switching**: See `BRAND_SWITCHER.md`
- **Deployment**: See `DEPLOYMENT.md`
- **API Reference**: Check `/src/app/api/` routes
- **Component Library**: Explore `/src/components/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

## 🎉 Quick Demo

1. **Clone the repo** and start development
2. **Try different brands** by changing `CURRENT_BRAND`
3. **Register a user** and see personal database creation
4. **Access admin panel** with `test@admin.com` / `admin123`
5. **Write content** and see it appear in the public blog

**Ready to launch your tech blog?** 🚀

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, NextAuth.js, and Notion API.