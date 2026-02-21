import type { Metadata } from "next";
import { Quicksand, Fredoka, Comfortaa } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--fw-quicksand",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--fw-fredoka",
  display: "swap",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--fw-comfortaa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoLazy",
  description:
    "Parent brand of LazyGames and ActiveGames. We specialize in high-rated, innovative titles that define the platform.",
  keywords:
    "GoLazy, GoLazy Studios, LazyGames, ActiveGames, Roblox game studio, Roblox simulators, Floor is Lava for Brainrots, Crush for Brainrots, Jetpack Training",
  authors: [{ name: "GoLazy" }],
  robots: "index, follow",
  metadataBase: new URL("https://www.golazy.net"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "GoLazy",
    siteName: "GoLazy",
    description:
      "Parent brand of LazyGames and ActiveGames. We specialize in high-rated, innovative titles that define the platform.",
    url: "https://www.golazy.net/",
    type: "website",
    images: [
      {
        url: "/assets/branding/GoLazyBanner.png",
        type: "image/png",
        width: 1920,
        height: 678,
        alt: "GoLazy - Parent brand of LazyGames and ActiveGames",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@LazyGamesTeam",
    title: "GoLazy",
    description:
      "Parent brand of LazyGames and ActiveGames. We specialize in high-rated, innovative titles that define the platform.",
    images: ["/assets/branding/GoLazyBanner.png"],
  },
  icons: {
    icon: [
      {
        url: "/assets/branding/GoLazyFav/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/assets/branding/GoLazyFav/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/assets/branding/GoLazyFav/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
    shortcut: "/assets/branding/GoLazyFav/favicon.ico",
  },
  manifest: "/assets/branding/GoLazyFav/site.webmanifest",
  other: {
    "msapplication-TileColor": "#da532c",
    "msapplication-config": "/assets/branding/GoLazyFav/browserconfig.xml",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GoLazy",
  alternateName: ["GoLazy Studios", "LazyGames", "ActiveGames"],
  url: "https://www.golazy.net",
  logo: "https://www.golazy.net/assets/branding/GoLazyBraindingMain.png",
  description:
    "Parent brand of LazyGames and ActiveGames. We specialize in high-rated, innovative titles that define the platform.",
  foundingDate: "2023",
  sameAs: [
    "https://discord.gg/UnhZDUH93X",
    "https://x.com/LazyGamesTeam",
    "https://www.roblox.com/communities/33472368/LazyGameStudios",
    "https://www.roblox.com/communities/35868694/ActiveGameStudios",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://discord.gg/UnhZDUH93X",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${fredoka.variable} ${comfortaa.variable}`}
    >
      <head>
        <meta name="theme-color" content="#0a0a0f" />
        <link rel="dns-prefetch" href="https://thumbnails.roproxy.com" />
        <link
          rel="preload"
          href="/assets/branding/GoLazyGameCard.png"
          as="image"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "4b70de09d99f4a84a5c58b5c30b61966"}'
        />
      </head>
      <body
        style={{
          fontFamily:
            "var(--fw-quicksand), Quicksand, Comfortaa, sans-serif",
        }}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
