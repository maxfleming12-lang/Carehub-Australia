import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "CareHub Australia | Professional Care Management Platform",
    template: "%s | CareHub Australia",
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
  authors: [{ name: "CareHub Australia" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://carehub.com.au"
  ),
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "CareHub Australia",
    title: "CareHub Australia | Professional Care Management Platform",
    description:
      "AI-powered tools for Australian care workers. Shift notes, care plans, burnout assessments, training courses and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareHub Australia | Professional Care Management Platform",
    description:
      "AI-powered tools for Australian care workers. Join thousands of professionals today.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-white`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
