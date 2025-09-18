import type { Metadata } from "next";
import { Inter, Merriweather, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthSessionProvider } from "@/components/session-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SkipToContent } from "@/components/skip-to-content";
import { getBrandMetadata } from "@/config/brand";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const brandMetadata = getBrandMetadata()

export const metadata: Metadata = {
  title: `${brandMetadata.title} - Modern Developer Blog`,
  description: brandMetadata.description,
  keywords: brandMetadata.keywords,
  authors: [{ name: brandMetadata.title }],
  creator: brandMetadata.title,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com", // Update this when deploying
    title: brandMetadata.openGraph.title,
    description: brandMetadata.openGraph.description,
    siteName: brandMetadata.title,
  },
  twitter: {
    card: "summary_large_image",
    title: brandMetadata.twitter.title,
    description: brandMetadata.twitter.description,
    creator: `@${brandMetadata.title.toLowerCase()}`,
  },
  metadataBase: new URL("https://your-domain.com"), // Update this when deploying
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable} font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased`}
      >
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SkipToContent />
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
