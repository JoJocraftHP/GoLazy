import type { Metadata } from "next";
import GamesPageClient from "./GamesPageClient";

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

export default function GamesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GamesPageClient />
    </>
  );
}
