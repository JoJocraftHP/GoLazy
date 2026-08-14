import type { Metadata } from "next";
import GamesPageClient from "./GamesPageClient";
import { GAMES } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Games",
  description:
    "Browse all GoLazy and LazyGames Roblox games — from Floor is Lava for Brainrots to Crush for Brainrots. Top-rated simulators with millions of plays.",
  alternates: {
    canonical: "/games",
  },
  openGraph: {
    title: "All GoLazy Games",
    description:
      "Browse all GoLazy and LazyGames Roblox games — top-rated simulators with millions of plays and 98%+ community ratings.",
    url: "https://www.golazy.net/games",
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.golazy.net",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "All Games",
      item: "https://www.golazy.net/games",
    },
  ],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "GoLazy Studios Roblox Games",
  numberOfItems: GAMES.length,
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  itemListElement: GAMES.map((g, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "VideoGame",
      name: g.title,
      description: g.description,
      // Point at our own canonical page; the Roblox listing is the sameAs
      url: `https://www.golazy.net/games/${g.slug}`,
      sameAs: g.url,
      datePublished: g.released,
      gamePlatform: "Roblox",
      applicationCategory: "Game",
      operatingSystem: "Cross-platform",
      publisher: { "@type": "Organization", name: "GoLazy" },
    },
  })),
};

export default function GamesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <GamesPageClient />
    </>
  );
}
