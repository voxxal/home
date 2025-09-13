import { browser } from "$app/environment";
import { render } from "svelte/server";

if (browser) {
  throw new Error(`recommendations can only be imported server-side`);
}

export interface RecommendationMetadata {
  rating?: "highly" | undefined;
  name: string;
  medium: "album" | "song" | "game" | "manga" | "tv show" | "book" | "thing";
  artist: string;
  img: string;
}

export const recommendations = Object.entries(
  import.meta.glob("/src/routes/media/entries/*.svelte", { eager: true })
).map(([filepath, rec]: [string, any]) => {
  return {
    ...(rec.metadata as RecommendationMetadata),
    img: `/images/recommendations/${rec.metadata.img}`,
    html: render(rec.default).body,
  };
});
