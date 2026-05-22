import type { Metadata, Viewport } from "next";
import { Quicksand, Fredoka, Comfortaa } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--fw-quicksand",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--fw-fredoka",
  display: "swap",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--fw-comfortaa",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GoLazy - Play Top Roblox Games",
    template: "%s | GoLazy",
  },
  description:
    "GoLazy Studios makes hit Roblox games. Play Floor is Lava for Brainrots, Crush for Brainrots, Jetpack Training and more — millions of plays, 98%+ ratings.",
  keywords:
    "GoLazy, GoLazy Studios, LazyGames, ActiveGames, Roblox game studio, Roblox simulators, Floor is Lava for Brainrots, Crush for Brainrots, Jetpack Training, Roblox brainrots games",
  authors: [{ name: "GoLazy" }],
  robots: "index, follow",
  metadataBase: new URL("https://www.golazy.net"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "GoLazy - Play Top Roblox Games",
    siteName: "GoLazy",
    description:
      "GoLazy Studios makes hit Roblox games. Play Floor is Lava for Brainrots, Crush for Brainrots, Jetpack Training and more — millions of plays, 98%+ ratings.",
    url: "https://www.golazy.net/",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/branding/GoLazyBanner.png",
        secureUrl: "https://www.golazy.net/assets/branding/GoLazyBanner.png",
        type: "image/png",
        width: 1920,
        height: 678,
        alt: "GoLazy - Parent brand of LazyGames and ActiveGames",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@GoLazyStudios",
    creator: "@GoLazyStudios",
    title: "GoLazy - Play Top Roblox Games",
    description:
      "GoLazy Studios makes hit Roblox games. Play Floor is Lava for Brainrots, Crush for Brainrots, Jetpack Training and more — millions of plays, 98%+ ratings.",
    images: [
      {
        url: "/assets/branding/GoLazyBanner.png",
        alt: "GoLazy - Parent brand of LazyGames and ActiveGames",
      },
    ],
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  appleWebApp: {
    capable: true,
    title: "GoLazy",
    statusBarStyle: "black-translucent",
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
    "msapplication-TileColor": "#0a0a0f",
    "msapplication-config": "/assets/branding/GoLazyFav/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
    "https://x.com/GoLazyStudios",
    "https://www.roblox.com/communities/33472368/LazyGameStudios",
    "https://www.roblox.com/communities/35868694/ActiveGameStudios",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://discord.gg/UnhZDUH93X",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GoLazy",
  url: "https://www.golazy.net",
  inLanguage: "en-US",
  publisher: { "@id": "https://www.golazy.net/#organization" },
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
        <link rel="preconnect" href="https://thumbnails.roproxy.com" crossOrigin="" />
        <link rel="preconnect" href="https://livestatsupdate.jojocrafthdyt.workers.dev" crossOrigin="" />
        <link rel="dns-prefetch" href="https://games.roproxy.com" />
        <link rel="dns-prefetch" href="https://groups.roproxy.com" />
        <link
          rel="preload"
          href="/assets/branding/GoLazyGameCard.png"
          as="image"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
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
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon='{"token": "4b70de09d99f4a84a5c58b5c30b61966"}'
        />
      </body>
    </html>
  );
}
