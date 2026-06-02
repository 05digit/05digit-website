import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
  metadataBase: new URL("https://05dig.it"),
  title: {
    default: "digit | 05digit - official website",
    template: "%s | digit"
  },
  description: "Official workspace and website of Lithuanian underground artist digit (05digit). Stream 'Primityva', 'Nebeskambink', 'apakau', 'perfect', 'deja vu' and connect.",
  keywords: [
    "digit", "05digit", "og version", "furytto", "proflame", "xguscia", "free finga", 
    "jessica shy", "lilas ir innomine", "sel 600", "g&g sindikatas", "solo ansamblis", 
    "mamis", "papi", "bielskis", "tautvydas burauskas", "despoting fam", "repas", 
    "atikin", "seneka", "dmnk", "conkretus", "mir", "kajuze", "morre", "urboo", 
    "barkodas", "praba", "remis retro", "svdominik", "fuxas", "335d", "lil skar", 
    "ankh", "enessy", "rycka", "dj wimpy", "dj nevykele", "audi bmw", "aerobika", 
    "yyori", "jayzed", "kylok", "kamuza", "mama apdovanojimai", "muile", "yada", 
    "mdnght", "jedski", "different dimension", "nevidonas", "basta", "dalbajobas",
    "lithuanian rap", "lithuanian hip hop", "lietuviskas repas", "lietuviska muzika", 
    "lithuanian underground", "supertrap lithuania", "trap lietuva", "hyperpop lithuania", 
    "vilnius underground", "apakau", "perfect", "primityva", "nebeskambink", "deja vu", 
    "pasukta galva"
  ],
  authors: [{ name: "digit" }],
  creator: "digit",
  publisher: "digit",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "lt_LT",
    url: "https://05dig.it",
    title: "digit // 05digit - official website",
    description: "Official workspace and website of Lithuanian underground artist digit (05digit). Stream latest tracks, watch visualizers, and connect.",
    siteName: "digit",
    images: [
      {
        url: "/songs/primityva cover v2 jpeg.jpg",
        width: 1200,
        height: 1200,
        alt: "digit - Primityva Cover Art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "digit // 05digit - official website",
    description: "Official workspace and website of Lithuanian underground artist digit (05digit). Stream latest tracks, watch visualizers, and connect.",
    images: ["/songs/primityva cover v2 jpeg.jpg"],
  },
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
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              "name": "digit",
              "alternateName": ["05digit", "digit music"],
              "url": "https://05dig.it",
              "image": "https://05dig.it/songs/primityva%20cover%20v2%20jpeg.jpg",
              "description": "Lithuanian underground hip-hop and electronic music artist, known for blending hyperpop, trap, and drum & bass.",
              "genre": ["Hip Hop", "Supertrap", "Hyperpop", "Drum & Bass"],
              "sameAs": [
                "https://open.spotify.com/artist/33z8eBD0nviVNHjKoe6kZZ?si=KBRyTTXrQoSX06e2hIlyxw",
                "https://music.apple.com/us/artist/digit/1524901037",
                "https://www.youtube.com/@05digit",
                "https://www.instagram.com/05digit/",
                "https://www.tiktok.com/@05digit"
              ],
              "track": [
                {
                  "@type": "MusicRecording",
                  "name": "Primityva",
                  "url": "https://www.youtube.com/watch?v=nNoiPOPh9j8"
                },
                {
                  "@type": "MusicRecording",
                  "name": "Nebeskambink",
                  "url": "https://www.youtube.com/watch?v=aX0aSpsqEy8"
                },
                {
                  "@type": "MusicRecording",
                  "name": "apakau",
                  "url": "https://www.youtube.com/watch?v=FRqvZ1aif4c"
                },
                {
                  "@type": "MusicRecording",
                  "name": "perfect",
                  "url": "https://www.youtube.com/watch?v=fAP2UOOGTn4"
                },
                {
                  "@type": "MusicRecording",
                  "name": "deja vu",
                  "url": "https://www.youtube.com/watch?v=TPwBpsgxirc"
                },
                {
                  "@type": "MusicRecording",
                  "name": "Pasukta galva",
                  "url": "https://www.youtube.com/watch?v=3SBb3v9r-J0"
                }
              ]
            })
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
