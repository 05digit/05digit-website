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
  title: "digit | 05digit",
  description: "Official website for underground artist digit aka 05digit. Stream music, watch official visualizers, and connect.",
  icons: {
    icon: [
      { url: "/favicon_io/favicon-32x32.png?v=05", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon-16x16.png?v=05", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon_io/favicon.ico?v=05",
    apple: "/favicon_io/apple-touch-icon.png?v=05",
  },
  manifest: "/favicon_io/site.webmanifest?v=05",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
