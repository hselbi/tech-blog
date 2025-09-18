# 🚀 Deployment Guide

Your tech blog is ready for deployment! Here's everything you need to know.

## 🎯 Pre-Deployment Checklist

### 1. **Choose Your Brand** ✅
- Open `/src/config/brand.ts`
- Set your preferred brand: `CURRENT_BRAND = 'codecraft'` (or any other option)
- All available options: `codecraft`, `devflow`, `techpulse`, `codecanvas`, `bytestream`, `stackshare`

### 2. **Environment Variables**
Create a `.env.production` file with:

```bash
# Notion Integration
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID=your_database_id
NOTION_PARENT_PAGE_ID=your_parent_page_id
ENABLE_NOTION_CMS=true
NOTION_CACHE_REVALIDATE=3600

# NextAuth Configuration
NEXTAUTH_SECRET=your_super_secret_key
NEXTAUTH_URL=https://yourdomain.com

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 3. **Update Domain References**
In `/src/app/layout.tsx`, update:
```typescript
url: "https://yourdomain.com",
metadataBase: new URL("https://yourdomain.com"),
```

## 🌐 Deployment Platforms

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Domain: vercel.com/dashboard
```

### **Netlify**
```bash
# Build command: npm run build
# Publish directory: .next
# Environment variables: Set in Netlify dashboard
```

### **Railway**
```bash
# Connect GitHub repo
# Auto-deploys on push
# Set environment variables in Railway dashboard
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Production Configuration

### **NextAuth Setup**
1. Generate a secure secret:
```bash
openssl rand -base64 32
```

2. Set your production domain in `NEXTAUTH_URL`

### **Notion Database Setup**
1. Create your main blog database in Notion
2. Get the database ID from the URL
3. Create a Notion integration and get the token
4. Share your database with the integration

### **OAuth Setup (Optional)**
1. **Google**: Create OAuth app in Google Cloud Console
2. **GitHub**: Create OAuth app in GitHub Settings
3. Add your production domain to redirect URIs

## 📊 Performance Optimization

### **Image Optimization**
- Next.js automatically optimizes images
- Consider using Cloudinary or similar for large media

### **Caching**
- Static pages are cached automatically
- Notion content is cached (configurable with `NOTION_CACHE_REVALIDATE`)

### **SEO Ready**
- ✅ Sitemap generation
- ✅ Meta tags and Open Graph
- ✅ JSON-LD structured data
- ✅ Responsive design
- ✅ Fast loading times

## 🔒 Security

### **Admin Access**
- Update admin email check in `/src/lib/auth.ts`
- Remove default admin user in production
- Use proper role-based access control

### **Environment Security**
- Never commit `.env` files
- Use platform-specific secret management
- Rotate secrets regularly

## 📈 Post-Deployment

### **Analytics**
Add Google Analytics or similar:
```bash
npm install @next/third-parties
```

### **Monitoring**
- Set up error monitoring (Sentry)
- Monitor performance (Vercel Analytics)
- Set up uptime monitoring

### **Content Management**
1. Create your first blog post in Notion
2. Set up your personal database
3. Configure user registration settings

## 🎯 Custom Domain Setup

### **Vercel**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### **DNS Configuration**
```
# For Vercel
CNAME www your-app.vercel.app
A @ 76.76.19.19
```

## 🔄 Continuous Deployment

### **Automatic Deployments**
- Connect your GitHub repository
- Enable auto-deploy on main branch
- Set up preview deployments for PRs

### **Build Optimization**
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "export": "next export"
  }
}
```

## 🎨 Brand Switching After Deployment

You can change brands anytime:
1. Update `CURRENT_BRAND` in `/src/config/brand.ts`
2. Commit and push changes
3. Auto-deployment will update your site

## 📝 Content Strategy

### **Blog Content Ideas**
- Tutorial series
- Project showcases
- Industry insights
- Personal experiences
- Tool reviews

### **SEO Tips**
- Use brand-specific keywords
- Create topic clusters
- Internal linking
- Regular content updates

## 🎉 Launch Checklist

- [ ] Brand selected and configured
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] First blog post published
- [ ] Admin access configured
- [ ] Analytics setup
- [ ] Social media links updated
- [ ] Testing on mobile devices
- [ ] Performance audit completed

**Ready to launch!** 🚀

Your tech blog is production-ready with:
- ✅ Multiple brand options
- ✅ User authentication & management
- ✅ Notion CMS integration
- ✅ Admin dashboard
- ✅ SEO optimization
- ✅ Responsive design
- ✅ Dark mode support