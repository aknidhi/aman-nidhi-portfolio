import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Aman Nidhi — AI/ML Developer & Data Analytics",
    template: "%s — Aman Nidhi",
  },

  description:
    "Portfolio of Aman Nidhi, an AI/ML Developer working across machine learning, agentic AI, data analytics and intelligent applications.",

  keywords: [
    "Aman Nidhi",
    "AI/ML Developer",
    "AI Developer",
    "Machine Learning",
    "Agentic AI",
    "Data Analytics",
    "Python",
    "LangChain",
    "LangGraph",
    "Power BI",
    "AI Portfolio",
  ],

  authors: [
    {
      name: "Aman Nidhi",
    },
  ],

  creator: "Aman Nidhi",

  openGraph: {
    title:
      "Aman Nidhi — AI/ML Developer & Data Analytics",

    description:
      "Portfolio of Aman Nidhi, an AI/ML Developer working across machine learning, agentic AI, data analytics and intelligent applications.",

    type: "website",
    locale: "en_IN",
    siteName: "Aman Nidhi",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aman Nidhi — AI/ML Developer & Data Analytics",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Aman Nidhi — AI/ML Developer & Data Analytics",

    description:
      "AI/ML Developer working across machine learning, agentic AI, data analytics and intelligent applications.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}