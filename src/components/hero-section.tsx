import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { getBrandName, getBrandTagline, getBrandDescription, getBrandLogo } from "@/config/brand"

export function HeroSection() {
  const brandName = getBrandName()
  const brandTagline = getBrandTagline()
  const brandDescription = getBrandDescription()
  const brandLogo = getBrandLogo()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-200 dark:bg-accent-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-secondary-200 dark:bg-secondary-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 mb-8 animate-bounce-in">
            <span className="mr-2">{brandLogo.icon}</span>
            Welcome to {brandName}
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 animate-slide-up">
            <span className="block">{brandName}</span>
            <span className="block bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
              {brandTagline}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            {brandDescription}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-400">
            <Link
              href="/blog"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-xl shadow-large hover:shadow-xl transition-all duration-300 focus-ring"
            >
              Explore Articles
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 focus-ring"
            >
              About Me
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in animation-delay-600">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">10k+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">25+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Free</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}