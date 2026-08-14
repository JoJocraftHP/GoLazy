import { GAMES, GROUPS, TEAM_CATEGORIES } from "./data";

const THUMBNAILS = "https://thumbnails.roproxy.com/v1";

const universeIds = GAMES.map((g) => g.universeId).join(",");
const groupIds = GROUPS.map((g) => g.id).join(",");
const userIds = TEAM_CATEGORIES.flatMap((c) =>
  c.members.map((m) => m.userId)
).join(",");

// One batched request per image kind — every card reads its own id out of the
// shared response instead of firing its own round-trip.
export const GAME_ICONS_URL =
  `${THUMBNAILS}/games/icons?universeIds=${universeIds}` +
  `&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`;

export const GAME_THUMBS_URL =
  `${THUMBNAILS}/games/multiget/thumbnails?universeIds=${universeIds}` +
  `&countPerUniverse=1&size=768x432&format=Png`;

export const GROUP_ICONS_URL =
  `${THUMBNAILS}/groups/icons?groupIds=${groupIds}&size=150x150&format=Png`;

export const AVATARS_URL =
  `${THUMBNAILS}/users/avatar-headshot?userIds=${userIds}&size=150x150&format=Png`;
