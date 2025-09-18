// Brand Configuration System
// Change the CURRENT_BRAND to switch between different brand identities

export type BrandConfig = {
  name: string
  shortName: string
  tagline: string
  description: string
  logo: {
    text: string
    icon: string
  }
  colors: {
    primary: string
    accent: string
    gradient: string
  }
  domain?: string
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}

// All available brand options
export const BRAND_OPTIONS: Record<string, BrandConfig> = {
  codecraft: {
    name: "CodeCraft",
    shortName: "CC",
    tagline: "Crafting Code & Content",
    description: "Where software development meets creative writing. Tutorials, insights, and experiences from a developer's journey.",
    logo: {
      text: "CodeCraft",
      icon: "🛠️"
    },
    colors: {
      primary: "#2563eb", // Blue
      accent: "#7c3aed", // Purple
      gradient: "from-blue-500 to-purple-600"
    }
  },
  devflow: {
    name: "DevFlow",
    shortName: "DF",
    tagline: "Developer Workflow & Insights",
    description: "Streamlining development processes, sharing workflows, and exploring the latest in software engineering.",
    logo: {
      text: "DevFlow",
      icon: "⚡"
    },
    colors: {
      primary: "#059669", // Emerald
      accent: "#0891b2", // Cyan
      gradient: "from-emerald-500 to-cyan-500"
    }
  },
  techpulse: {
    name: "TechPulse",
    shortName: "TP",
    tagline: "Stay Current, Stay Ahead",
    description: "Your pulse on the latest technology trends, frameworks, and industry insights.",
    logo: {
      text: "TechPulse",
      icon: "📡"
    },
    colors: {
      primary: "#dc2626", // Red
      accent: "#ea580c", // Orange
      gradient: "from-red-500 to-orange-500"
    }
  },
  codecanvas: {
    name: "CodeCanvas",
    shortName: "CC",
    tagline: "Where Code Meets Creativity",
    description: "Painting the digital world with code. Creative solutions, artistic approaches to programming.",
    logo: {
      text: "CodeCanvas",
      icon: "🎨"
    },
    colors: {
      primary: "#7c2d12", // Brown
      accent: "#be185d", // Pink
      gradient: "from-amber-500 to-pink-500"
    }
  },
  bytestream: {
    name: "ByteStream",
    shortName: "BS",
    tagline: "Continuous Flow of Knowledge",
    description: "A steady stream of bytes, bits, and brilliant ideas from the world of software development.",
    logo: {
      text: "ByteStream",
      icon: "🌊"
    },
    colors: {
      primary: "#0369a1", // Sky blue
      accent: "#1d4ed8", // Blue
      gradient: "from-sky-500 to-blue-600"
    }
  },
  stackshare: {
    name: "StackShare",
    shortName: "SS",
    tagline: "Sharing Development Stacks",
    description: "Deep dives into technology stacks, architecture decisions, and development experiences.",
    logo: {
      text: "StackShare",
      icon: "📚"
    },
    colors: {
      primary: "#6366f1", // Indigo
      accent: "#8b5cf6", // Violet
      gradient: "from-indigo-500 to-violet-500"
    }
  }
}

// Set your preferred brand here - change this to switch brands instantly!
export const CURRENT_BRAND: keyof typeof BRAND_OPTIONS = 'codecraft'

// Get the current brand configuration
export const getBrandConfig = (): BrandConfig => {
  return BRAND_OPTIONS[CURRENT_BRAND]
}

// Helper functions for common brand elements
export const getBrandName = () => getBrandConfig().name
export const getBrandTagline = () => getBrandConfig().tagline
export const getBrandDescription = () => getBrandConfig().description
export const getBrandLogo = () => getBrandConfig().logo
export const getBrandColors = () => getBrandConfig().colors

// Generate brand-specific metadata
export const getBrandMetadata = () => {
  const brand = getBrandConfig()
  return {
    title: brand.name,
    description: brand.description,
    keywords: [
      'blog',
      'tech',
      'development',
      'programming',
      'software',
      'coding',
      'tutorials',
      brand.name.toLowerCase()
    ].join(', '),
    openGraph: {
      title: `${brand.name} | ${brand.tagline}`,
      description: brand.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brand.name} | ${brand.tagline}`,
      description: brand.description,
    }
  }
}