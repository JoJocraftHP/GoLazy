import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GameDetailClient from "./GameDetailClient";
import { GAMES } from "@/lib/data";

const SITE = "https://www.golazy.net";

export function generateStaticParams() {
  return GAMES.map((game) => ({ slug: game.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = GAMES.find((g) => g.slug === slug);

  if (!game) {
    return { title: "Game Not Found" };
  }

  const url = `${SITE}/games/${game.slug}`;

  return {
    title: game.title,
    description: game.description,
    alternates: { canonical: `/games/${game.slug}` },
    openGraph: {
      title: `${game.title} | GoLazy`,
      description: game.description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.title} | GoLazy`,
      description: game.description,
    },
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = GAMES.find((g) => g.slug === slug);

  if (!game) {
    notFound();
  }

  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    url: `${SITE}/games/${game.slug}`,
    sameAs: game.url,
    playMode: "MultiPlayer",
    gamePlatform: "Roblox",
    applicationCategory: "Game",
    operatingSystem: "Cross-platform",
    datePublished: game.released,
    publisher: { "@type": "Organization", name: "GoLazy" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "All Games", item: `${SITE}/games` },
      {
        "@type": "ListItem",
        position: 3,
        name: game.title,
        item: `${SITE}/games/${game.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GameDetailClient game={game} />
    </>
  );
}
