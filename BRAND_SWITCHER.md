# 🎨 Brand Switcher Guide

Your blog now supports **instant brand switching**! Change the entire look, feel, and content with just one line of code.

## 🚀 How to Switch Brands

1. Open `/src/config/brand.ts`
2. Change the `CURRENT_BRAND` value to any of these options:

```typescript
export const CURRENT_BRAND: keyof typeof BRAND_OPTIONS = 'codecraft' // Change this!
```

## 🎯 Available Brand Options

### 1. **CodeCraft** (`codecraft`)
- **Name**: CodeCraft
- **Tagline**: "Crafting Code & Content"
- **Theme**: Blue & Purple
- **Perfect for**: Full-stack developers, tutorial creators

### 2. **DevFlow** (`devflow`)
- **Name**: DevFlow
- **Tagline**: "Developer Workflow & Insights"
- **Theme**: Emerald & Cyan
- **Perfect for**: DevOps, productivity, workflows

### 3. **TechPulse** (`techpulse`)
- **Name**: TechPulse
- **Tagline**: "Stay Current, Stay Ahead"
- **Theme**: Red & Orange
- **Perfect for**: Tech news, trends, industry insights

### 4. **CodeCanvas** (`codecanvas`)
- **Name**: CodeCanvas
- **Tagline**: "Where Code Meets Creativity"
- **Theme**: Amber & Pink
- **Perfect for**: Creative coding, UI/UX development

### 5. **ByteStream** (`bytestream`)
- **Name**: ByteStream
- **Tagline**: "Continuous Flow of Knowledge"
- **Theme**: Sky Blue & Blue
- **Perfect for**: Data science, streaming, continuous learning

### 6. **StackShare** (`stackshare`)
- **Name**: StackShare
- **Tagline**: "Sharing Development Stacks"
- **Theme**: Indigo & Violet
- **Perfect for**: Architecture, tech stacks, deep dives

## 🎨 What Changes When You Switch:

- ✅ **Brand name** throughout the entire app
- ✅ **Logo and colors**
- ✅ **Page titles and descriptions**
- ✅ **SEO metadata**
- ✅ **Social media previews**
- ✅ **Navigation and hero sections**
- ✅ **All text content and taglines**

## 🛠️ Adding Your Own Brand

Want to create a custom brand? Add it to the `BRAND_OPTIONS` in `/src/config/brand.ts`:

```typescript
mybrand: {
  name: "MyBrand",
  shortName: "MB",
  tagline: "Your Custom Tagline",
  description: "Your brand description...",
  logo: {
    text: "MyBrand",
    icon: "🚀"
  },
  colors: {
    primary: "#your-color",
    accent: "#your-accent",
    gradient: "from-your-color to-your-accent"
  }
}
```

Then set: `CURRENT_BRAND = 'mybrand'`

## 📱 Preview Changes

After changing the brand:
1. Save the file
2. Your dev server will auto-reload
3. See the changes instantly!

## 🚀 For Production Deployment

1. Choose your final brand
2. Update the domain in `/src/app/layout.tsx`
3. Update environment variables if needed
4. Deploy!

**Current Brand**: ${CURRENT_BRAND} (${getBrandName()})