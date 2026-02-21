export interface Game {
  title: string;
  universeId: string;
  url: string;
  fallbackImage: string;
  alt: string;
}

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
    universeId: "9564163170",
    url: "https://www.roblox.com/games/128909126739170/Floor-is-Lava-for-Brainrots",
    fallbackImage: "/assets/branding/GoLazyGameCard.png",
    alt: "Floor is Lava for Brainrots - Popular Roblox simulator game",
  },
  {
    title: "Crush for Brainrots",
    universeId: "8357236286",
    url: "https://www.roblox.com/games/117579798602171/UPD5-Crush-for-Brainrots",
    fallbackImage: "/assets/GameIcons/CrushTN1.png",
    alt: "Crush for Brainrots - Top-rated Roblox game with 98.5% rating",
  },
  {
    title: "Jetpack Training",
    universeId: "7017269091",
    url: "https://www.roblox.com/games/95557214969049",
    fallbackImage: "/assets/GameIcons/JetpackTN1.png",
    alt: "Jetpack Training - Roblox training simulator game by LazyGames",
  },
  {
    title: "Lift a Pet",
    universeId: "5792683386",
    url: "https://www.roblox.com/games/16858182871",
    fallbackImage: "/assets/GameIcons/LAPTN1.png",
    alt: "Lift a Pet - Roblox pet simulator game by ActiveGames",
  },
  {
    title: "Escape Color Block for Brainrots",
    universeId: "9697706765",
    url: "https://www.roblox.com/games/82425850234122/Escape-Color-Block-for-Brainrots",
    fallbackImage: "/assets/branding/GoLazyGameCard.png",
    alt: "Escape Color Block for Brainrots - Roblox game by GoLazy",
  },
  {
    title: "Monster Training",
    universeId: "7676176341",
    url: "https://www.roblox.com/games/78263156263540",
    fallbackImage: "/assets/GameIcons/MonsterTN1.png",
    alt: "Monster Training - Roblox monster simulator game",
  },
];

export const GROUPS: Group[] = [
  {
    id: "33472368",
    name: "LazyGames",
    url: "https://www.roblox.com/communities/33472368/LazyGameStudios#!/about",
    fallbackImage: "/assets/StudioIcons/LazyStudios.png",
  },
  {
    id: "35868694",
    name: "ActiveGames",
    url: "https://www.roblox.com/communities/35868694/ActiveGameStudios#!/about",
    fallbackImage: "/assets/StudioIcons/ActiveGames.png",
  },
];

export const TEAM_CATEGORIES: TeamCategory[] = [
  {
    label: "Founders",
    members: [
      {
        name: "JoJocraftHP",
        role: "Owner, Game Design & Management",
        userId: "214865113",
        profileUrl: "https://www.roblox.com/users/214865113/profile",
        fallbackImage: "/assets/profiles/JoJoProfile.png",
      },
      {
        name: "mitex",
        role: "Co-Owner, Scripter",
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
        name: "Reexify",
        role: "Scripter",
        userId: "205658940",
        profileUrl: "https://www.roblox.com/users/205658940/profile",
        fallbackImage: "/assets/profiles/DefaultProfile.png",
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
