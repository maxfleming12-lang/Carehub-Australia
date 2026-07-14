import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: {
    default: "Scribe & Thrive Australia | Professional Care Management Platform",
    template: "%s | Scribe & Thrive Australia",
  },
  description:
    "The comprehensive SaaS platform for Australian care workers, disability support professionals, and aged care organisations. AI-powered tools, training, and resources.",
  keywords: [
    "NDIS",
    "aged care",
    "disability support",
    "carer tools",
    "care management",
    "Australia",
    "shift notes",
    "care plans",
    "burnout assessment",
  ],
  authors: [{ name: "Scribe & Thrive Australia" }],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Scribe & Thrive Australia",
    title: "Scribe & Thrive Australia | Professional Care Management Platform",
    description:
      "AI-powered tools for Australian care workers. Shift notes, care plans, burnout assessments, training courses and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scribe & Thrive Australia | Professional Care Management Platform",
    description:
      "AI-powered tools for Australian care workers, including shift notes, care plans, burnout assessments, training courses and resources.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const BASE_URL = SITE_URL;

// Organization + WebSite structured data for search engines.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Scribe & Thrive Australia",
      legalName: "Scribe & Thrive Australia Pty Ltd",
      url: BASE_URL,
      email: "hello@sataus.net",
      telephone: "+61 451 381 843",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Sydney",
        addressRegion: "NSW",
        addressCountry: "AU",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      name: "Scribe & Thrive Australia",
      url: BASE_URL,
      publisher: { "@id": `${BASE_URL}/#organization` },
      inLanguage: "en-AU",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body className="antialiased bg-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-teal-700 focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
