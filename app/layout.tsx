import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pekkerai.com'), // Custom domain
  title: "PekkerAI — AI-Powered SEO Content Pipeline | Rank Higher in Minutes",
  description: "The ultra-lean AI content pipeline for founders and SEO freelancers. Go from a target keyword to a publish-ready, highly researched article for just $1. Rank higher in minutes, not hours.",
  applicationName: 'PekkerAI',
  keywords: ['SEO content generator', 'AI writer', 'SEO pipeline', 'automated blog writing', 'SEO for founders'],
  authors: [{ name: 'PekkerAI Team' }],
  creator: 'PekkerAI',
  publisher: 'PekkerAI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'PekkerAI — AI-Powered SEO Content Pipeline',
    description: 'Go from a target keyword to a publish-ready, highly researched article for just $1. Rank higher in minutes, not hours.',
    url: 'https://pekkerai.com', // Custom domain
    siteName: 'PekkerAI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PekkerAI — AI-Powered SEO Content Pipeline',
    description: 'Go from a target keyword to a publish-ready, highly researched article for just $1.',
    creator: '@PekkerAI',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    other: {
      'msvalidate.01': 'PLACE_YOUR_BING_CODE_HERE',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
