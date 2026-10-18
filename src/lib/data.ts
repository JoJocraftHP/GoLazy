export interface Game {
  title: string;
  slug: string;
  universeId: string;
  url: string;
  fallbackImage: string;
  alt: string;
  /** Shown on the game page and used as its meta description. */
  description: string;
  /** Roblox creation date, ISO yyyy-mm-dd. Drives the NEW badge. */
  released: string;
}

/** A game counts as new for this many days after release. */
export const NEW_GAME_DAYS = 60;

export interface Group {
  id: string;
  name: string;
  url: string;
  fallbackImage: string;
}

export interface TeamMember {
  name: string;
  role: string;
  userId: string;
  profileUrl: string;
  fallbackImage: string;
}

export interface TeamCategory {
  label: string;
  members: TeamMember[];
}

export const GAMES: Game[] = [
  {
    title: "Floor is Lava for Brainrots",
    slug: "floor-is-lava-for-brainrots",
    universeId: "9564163170",
    url: "https://www.roblox.com/games/128909126739170/Floor-is-Lava-for-Brainrots",
    fallbackImage: "/assets/branding/GoLazyGameCard.png",
    alt: "Floor is Lava for Brainrots - Popular Roblox simulator game",
    description:
      "Run fast and collect Brainrots before the floor turns to lava. Jump between platforms, upgrade your base and grow the rarest collection on the server.",
    released: "2026-01-15",
  },
  {
    title: "Crush for Brainrots",
    slug: "crush-for-brainrots",
    universeId: "8357236286",
    url: "https://www.roblox.com/games/117579798602171/UPD5-Crush-for-Brainrots",
    fallbackImage: "/assets/GameIcons/CrushTN1.png",
    alt: "Crush for Brainrots - Top-rated Roblox game with 98.5% rating",
    description:
      "Crush crates to unlock Brainrots, upgrade your Crusher for more speed and luck, and collect the rarest Brainrots in the game.",
    released: "2025-08-05",
  },
  {
    title: "Jetpack Training",
    slug: "jetpack-training",
    universeId: "7017269091",
    url: "https://www.roblox.com/games/95557214969049",
    fallbackImage: "/assets/GameIcons/JetpackTN1.png",
    alt: "Jetpack Training - Roblox training simulator game by LazyGames",
    description:
      "Train your Power, race other players for Wins, and spend them on overpowered jetpacks. Open eggs to collect pets along the way.",
    released: "2025-01-01",
  },
  {
    title: "Lift a Pet",
    slug: "lift-a-pet",
    universeId: "5792683386",
    url: "https://www.roblox.com/games/16858182871",
    fallbackImage: "/assets/GameIcons/LAPTN1.png",
    alt: "Lift a Pet - Roblox pet simulator game by ActiveGames",
    description:
      "Build Strength to lift heavier pets, open eggs and stack up Wins in this pet lifting simulator, with free gifts every few minutes.",
    released: "2024-03-24",
  },
  {
    title: "Escape Color Block for Brainrots",
    slug: "escape-color-block-for-brainrots",
    universeId: "9697706765",
    url: "https://www.roblox.com/games/82425850234122/Escape-Color-Block-for-Brainrots",
    fallbackImage: "/assets/branding/GoLazyGameCard.png",
    alt: "Escape Color Block for Brainrots - Roblox game by GoLazy",
    description:
      "Match the right colour or fall through the floor. Collect Brainrots, race them back to your base and upgrade for bigger earnings.",
    released: "2026-02-08",
  },
  {
    title: "Monster Training",
    slug: "monster-training",
    universeId: "7676176341",
    url: "https://www.roblox.com/games/78263156263540",
    fallbackImage: "/assets/GameIcons/MonsterTN1.png",
    alt: "Monster Training - Roblox monster simulator game",
    description:
      "Build Power, race for Wins and unlock overpowered monsters. Open eggs to collect pets and climb your way up the leaderboard.",
    released: "2025-05-10",
  },
  {
    title: "Double Jump for Brainrots!",
    slug: "double-jump-for-brainrots",
    universeId: "9701551380",
    url: "https://www.roblox.com/games/96872770738990",
    fallbackImage: "/assets/branding/GoLazyGameCard.png",
    alt: "Double Jump for Brainrots! - Roblox game by GoLazy",
    description:
      "Double jump your way into the sky, discover floating islands and grab the rarest Brainrot spawns before anyone else reaches them.",
    released: "2026-02-09",
  },
  {
    title: "Guess the Path for Brainrots",
    slug: "guess-the-path-for-brainrots",
    universeId: "9697705202",
    url: "https://www.roblox.com/games/113500276693848",
    fallbackImage: "/assets/branding/GoLazyGameCard.png",
    alt: "Guess the Path for Brainrots - Roblox game by GoLazy",
    description:
      "Think fast and pick the right path. One wrong step and you are out. Collect Brainrots and trust your instincts to survive each round.",
    released: "2026-02-08",
  },
  {
    title: "Crush Walls for Brainrots",
    slug: "crush-walls-for-brainrots",
    universeId: "9697689575",
    url: "https://www.roblox.com/games/108971149268278/Crush-Walls-for-Brainrots",
    fallbackImage: "/assets/branding/GoLazyGameCard.png",
    alt: "Crush Walls for Brainrots - Roblox game by GoLazy",
    description:
      "Punch through massive walls to progress, upgrade your Brainrots to earn more cash and expand your base for bigger rewards.",
    released: "2026-02-08",
  },
  {
    title: "Squishy Dumpling Duel",
    slug: "squishy-dumpling-duel",
    universeId: "10096982704",
    url: "https://www.roblox.com/games/75555951777956/Squishy-Dumpling-Duel",
    fallbackImage: "/assets/branding/GoLazyGameCard.png",
    alt: "Squishy Dumpling Duel - Roblox game by GoLazy",
    description:
      "Duel an opponent across nine boxes hiding one glitter dumpling. Find it first to win the round. Pick fast and pick smart.",
    released: "2026-04-29",
  },
  {
    title: "Hungry Animals",
    slug: "hungry-animals",
    universeId: "8827308630",
    url: "https://www.roblox.com/games/117215991955643/Hungry-Animals",
    fallbackImage: "/assets/branding/GoLazyGameCard.png",
    alt: "Hungry Animals - Roblox garden and animal collecting game by ActiveGames",
    description:
      "Grow food in your garden and shoot it at animals to collect them. Your animals earn cash while you unlock rarer crops and species.",
    released: "2025-09-28",
  },
  {
    title: "Deep Fishing",
    slug: "deep-fishing",
    universeId: "10526853622",
    url: "https://www.roblox.com/games/132239307080610/Deep-Fishing",
    fallbackImage: "/assets/branding/GoLazyGameCard.png",
    alt: "Deep Fishing - Roblox fishing simulator game by LazyGames",
    description:
      "Cast as far as you can and reel in tons of fish. Upgrade your Strength to reach new waters, catch several fish per cast and sell your haul.",
    released: "2026-07-18",
  },
  {
    title: "+1 Health for Brainrots",
    slug: "1-health-for-brainrots",
    universeId: "10078651002",
    url: "https://www.roblox.com/games/136709177643541/1-Health-for-Brainrots",
    fallbackImage: "/assets/branding/GoLazyGameCard.png",
    alt: "+1 Health for Brainrots - Roblox game by ActiveGames",
    description:
      "Upgrade your health to unlock new areas and grow stronger. Your Brainrots keep earning health for you even while you are offline.",
    released: "2026-04-24",
  },
];

export const GROUPS: Group[] = [
  {
    id: "12416224",
    name: "CrashSmash",
    url: "https://www.roblox.com/communities/12416224/CrashSmash#!/about",
    fallbackImage: "/assets/branding/GoLazyFav/android-chrome-192x192.png",
  },
  {
    id: "35868694",
    name: "ActiveGames",
    url: "https://www.roblox.com/communities/35868694/ActiveGameStudios#!/about",
    fallbackImage: "/assets/StudioIcons/ActiveGames.png",
  },
  {
    id: "34744238",
    name: "LazyGames.",
    url: "https://www.roblox.com/communities/34744238/LazyGames#!/about",
    fallbackImage: "/assets/branding/GoLazyFav/android-chrome-192x192.png",
  },
  {
    id: "33472368",
    name: "LazyGames",
    url: "https://www.roblox.com/communities/33472368/LazyGameStudios#!/about",
    fallbackImage: "/assets/StudioIcons/LazyStudios.png",
  },
];

export const TEAM_CATEGORIES: TeamCategory[] = [
  {
    label: "Founders",
    members: [
      {
        name: "JoJocraftHP",
        role: "Owner/Management",
        userId: "214865113",
        profileUrl: "https://www.roblox.com/users/214865113/profile",
        fallbackImage: "/assets/profiles/JoJoProfile.png",
      },
      {
        name: "mitex",
        role: "Co-Owner/Scripter",
        userId: "271040226",
        profileUrl: "https://www.roblox.com/users/271040226/profile",
        fallbackImage: "/assets/profiles/MitexProfile.png",
      },
    ],
  },
  {
    label: "Developers",
    members: [
      {
        name: "Lumpi",
        role: "Lead Builder/Modeler",
        userId: "1441090007",
        profileUrl: "https://www.roblox.com/users/1441090007/profile",
        fallbackImage: "/assets/profiles/LumpiProfile.png",
      },
      {
        name: "EpictoCraft",
        role: "Builder",
        userId: "1841149124",
        profileUrl: "https://www.roblox.com/users/1841149124/profile",
        fallbackImage: "/assets/profiles/EpicProfile.png",
      },
      {
        name: "JustaDev",
        role: "Management",
        userId: "2237059307",
        profileUrl: "https://www.roblox.com/users/2237059307/profile",
        fallbackImage: "/assets/profiles/DefaultProfile.png",
      },
    ],
  },
  {
    label: "Community Managers",
    members: [
      {
        name: "katie",
        role: "Community Manager",
        userId: "247630320",
        profileUrl: "https://www.roblox.com/users/247630320/profile",
        fallbackImage: "/assets/profiles/DefaultProfile.png",
      },
      {
        name: "Mupfel_HD12",
        role: "Community Manager",
        userId: "813898095",
        profileUrl: "https://www.roblox.com/users/813898095/profile",
        fallbackImage: "/assets/profiles/DefaultProfile.png",
      },
    ],
  },
];
