import type { Metadata } from 'next';

/**
 * Base SEO configuration for Blue Ledger
 */
const baseSeoConfig = {
  siteName: 'Blue Ledger',
  title: 'Blue Ledger - Smart Expense Management',
  description: 'Track expenses, split bills, and manage group finances with ease.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://blueledger.production.joao-carvalho.com/',
  ogImage: '/app_screenshot.png',
  twitterHandle: '@blueledger',
};

/**
 * Generate comprehensive metadata for pages
 */
export function generateMetadata(
  overrides: Partial<Metadata> = {},
  pagePath: string = '',
): Metadata {
  const url = `${baseSeoConfig.url}${pagePath}`;

  return {
    title: baseSeoConfig.title,
    description: baseSeoConfig.description,

    // Basic meta tags
    keywords: [
      'expense tracking',
      'bill splitting',
      'group expenses',
      'financial management',
      'budget tracking',
      'receipt scanning',
      'money management',
      'shared expenses',
    ],

    authors: [{ name: 'Blue Ledger Team' }],
    creator: 'Blue Ledger',
    publisher: 'Blue Ledger',

    // Canonical URL
    alternates: {
      canonical: url,
    },

    // Open Graph
    openGraph: {
      title: baseSeoConfig.title,
      description: baseSeoConfig.description,
      url,
      siteName: baseSeoConfig.siteName,
      images: [
        {
          url: baseSeoConfig.ogImage,
          width: 1200,
          height: 630,
          alt: 'Blue Ledger - Smart Expense Management',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: baseSeoConfig.title,
      description: baseSeoConfig.description,
      images: [baseSeoConfig.ogImage],
      creator: baseSeoConfig.twitterHandle,
    },

    // Additional meta tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        'index': true,
        'follow': true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification (add your actual verification codes)
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || '',
      yandex: process.env.YANDEX_VERIFICATION || '',
      other: {
        'msvalidate.01': process.env.BING_VERIFICATION || '',
      },
    },

    // App metadata
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: baseSeoConfig.siteName,
    },

    formatDetection: {
      telephone: false,
    },

    // Override with page-specific metadata
    ...overrides,
  };
}

/**
 * Generate structured data (JSON-LD) for the website
 */
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': baseSeoConfig.siteName,
    'description': baseSeoConfig.description,
    'url': baseSeoConfig.url,
    'applicationCategory': 'FinanceApplication',
    'operatingSystem': 'Web Browser',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
    'creator': {
      '@type': 'Organization',
      'name': 'Blue Ledger',
      'url': baseSeoConfig.url,
    },
    'featureList': [
      'Expense Tracking',
      'Bill Splitting',
      'Group Management',
      'Receipt Scanning',
      'Financial Analytics',
      'Real-time Notifications',
    ],
  };
}

/**
 * Generate organization structured data
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': baseSeoConfig.siteName,
    'url': baseSeoConfig.url,
    'logo': `${baseSeoConfig.url}/hand-coins.png`,
    'description': baseSeoConfig.description,
  };
}

/**
 * Page-specific SEO configurations
 */
export const pageSeoConfigs = {
  'home': {
    title: 'Blue Ledger - Smart Expense Management & Bill Splitting',
    description: 'Blueledger is a showcase application. A modern, performant, mobile-friendly expense-tracking web app with advanced UI/UX and AI integration.',
  },

  'dashboard': {
    title: 'Dashboard - Blue Ledger',
    description: 'View your expense analytics, track spending patterns, and manage your financial data.',
  },

  'expenses': {
    title: 'Expenses - Blue Ledger',
    description: 'Manage and track all your expenses. Add receipts, categorize spending, and analyze your financial habits.',
  },

  'groups': {
    title: 'Groups - Blue Ledger',
    description: 'Create and manage expense groups. Split bills with friends, family, and colleagues effortlessly.',
  },

  'friends': {
    title: 'Friends - Blue Ledger',
    description: 'Connect with friends and manage your social expense network. Send invitations and track shared expenses.',
  },

  'profile': {
    title: 'Profile - Blue Ledger',
    description: 'Manage your account settings, profile information, and preferences.',
  },

  'signin': {
    title: 'Sign In - Blue Ledger',
    description: 'Sign in to your Blue Ledger account to access your expense management dashboard.',
  },

  'signup': {
    title: 'Sign Up - Blue Ledger',
    description: 'Create your free Blue Ledger account and start managing expenses smarter today.',
  },

  'forgot-password': {
    title: 'Forgot Password - Blue Ledger',
    description: 'Reset your password to regain access to your Blue Ledger account.',
  },

  'verify-email': {
    title: 'Verify Email - Blue Ledger',
    description: 'Verify your email address to complete your Blue Ledger account setup.',
  },
} as const;
