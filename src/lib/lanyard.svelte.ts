import { readable } from "svelte/store";

export interface LanyardMethod {
  type: "socket" | "rest";
  restInterval?: number;
}

export enum LanyardWebSocketOpcode {
  EVENT = 0,
  HELLO = 1,
  INITIALIZE = 2,
  HEARTBEAT = 3,
}

export type LanyardWebSocketEvent = "INIT_STATE" | "PRESENCE_UPDATE";

export interface LanyardWebSocketMessage {
  op: LanyardWebSocketOpcode;
  seq: number;
  t: LanyardWebSocketEvent;
  d: LanyardData;
}

export type LanyardRestResponse = {
  success: boolean;
} & LanyardRestPossibleResponse;

type LanyardRestPossibleResponse =
  | { data: LanyardData }
  | { error: { message: string; code: string } };

export interface LanyardData {
  spotify: LanyardSpotifyData | null;
  kv: { [key: string]: string };
  listening_to_spotify: boolean;
  discord_user: LanyardDiscordUser;
  discord_status: string;
  activities: LanyardDiscordActivity[];
  active_on_discord_mobile: boolean;
  active_on_discord_desktop: boolean;
}

export interface LanyardTimestamps {
  start: number;
  end: number;
}

export interface LanyardSpotifyData {
  track_id: string;
  timestamps: LanyardTimestamps;
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

export interface LanyardDiscordUser {
  username: string;
  public_flags: number;
  id: number;
  discriminator: string;
  avatar: string;
}

export interface LanyardDiscordEmoji {
  name: string;
  id: number;
  animated: boolean;
}

export interface LanyardDiscordParty {
  id: string;
}

export interface LanyardDiscordAssets {
  small_text: string;
  small_image: string;
  large_text: string;
  large_image: string;
}

export interface LanyardDiscordActivity {
  type: number;
  state: string;
  name: string;
  id: string;
  emoji?: LanyardDiscordEmoji;
  created_at: number;
  timestamps?: LanyardTimestamps;
  sync_id?: string;
  session_id?: string;
  party?: LanyardDiscordParty;
  flags?: number;
  details?: string;
  assets?: LanyardDiscordAssets;
  application_id?: number;
}

const API_URL = "https://api.lanyard.rest/v1";
const WS_URL = "wss://api.lanyard.rest/socket";
const WS_HEARTBEAT = 30e3;

export class Lanyard implements LanyardData {
  spotify: LanyardSpotifyData | null;
  kv: { [key: string]: string };
  listening_to_spotify: boolean;
  discord_user: LanyardDiscordUser;
  discord_status: string;
  activities: LanyardDiscordActivity[];
  active_on_discord_mobile: boolean;
  active_on_discord_desktop: boolean;

  set(data: LanyardData) {
    this.spotify = data.spotify;
    this.kv = data.kv;
    this.listening_to_spotify = data.listening_to_spotify;
    this.discord_user = data.discord_user;
    this.discord_status = data.discord_status;
    this.activities = data.activities;
    this.active_on_discord_mobile = data.active_on_discord_mobile;
    this.active_on_discord_desktop = data.active_on_discord_desktop;
  }

  constructor(id: string, method?: LanyardMethod) {
    if (method && method.type === "rest") {
      if (!("fetch" in window)) throw new Error("svelte-lanyard only works clientside");
      const fetchLanyardData = () => {
        fetch(`${API_URL}/users/${id}`).then((res) => {
          res.json().then((res) => {
            if (!res.success) throw new Error(res.error?.message || "An unknown error occurred");

            this.set(res.data as LanyardData);
          });
        });
      }
      fetchLanyardData();
    }
  }
}

export function useLanyard(id: string, method?: LanyardMethod) {
  if (!id) throw new Error("A Discord user ID must be specified");

  const lanyardData = readable<LanyardData>(undefined, (set) => {
    if (method && method.type === "rest") {
      if (!("fetch" in window)) throw new Error("svelte-lanyard only works clientside");

      function fetchLanyardData() {
        fetch(`${API_URL}/users/${id}`).then((res) => {
          res.json().then((res) => {
            if (!res.success) throw new Error(res.error?.message || "An unknown error occurred");

            set(res.data as LanyardData);
          });
        });
      }

      fetchLanyardData();

      const interval = setInterval(() => {
        fetchLanyardData();
      }, method.restInterval);

      return function stop() {
        clearInterval(interval);
      };
    } else {
      if (!("WebSocket" in window || "MozWebSocket" in window))
        throw new Error("svelte-lanyard only works clientside");

      const socket = new WebSocket(WS_URL);
      let interval: any;

      socket.addEventListener("open", () => {
        socket.send(
          JSON.stringify({
            op: 2,
            d: {
              subscribe_to_id: id,
            },
          })
        );

        interval = setInterval(() => {
          socket.send(JSON.stringify({ op: 3 }));
        }, WS_HEARTBEAT);
      });

      socket.addEventListener("message", ({ data }: { data: string }) => {
        const { op, seq, t, d }: LanyardWebSocketMessage = JSON.parse(data);

        if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") set(d);
      });

      return function stop() {
        socket.close();
        clearInterval(interval);
      };
    }
  });

  return lanyardData;
}
