import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wilberforce Academy Creative Night - Sermon Transcription",
  description: "Real-time sermon transcription and translation for global ministry. Join Wilberforce Academy Creative Night for live transcripts in multiple languages.",
  keywords: ["sermon", "transcription", "translation", "wilberforce", "academy", "creative night", "real-time", "multilingual"],
  authors: [{ name: "Wilberforce Academy" }],
  creator: "Wilberforce Academy",
  publisher: "Wilberforce Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://wilberforce-academy.netlify.app'),
  openGraph: {
    title: "Wilberforce Academy Creative Night",
    description: "Real-time sermon transcription and translation for global ministry",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wilberforce Academy Creative Night",
    description: "Real-time sermon transcription and translation for global ministry",
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3fad7' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1419' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wilberforce Academy" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#f3fad7" />
        <meta name="theme-color" content="#f3fad7" />
      </head>
      <body
        className={`${manrope.variable} antialiased h-full bg-gradient-to-br from-green-50 to-blue-50`}
      >
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
