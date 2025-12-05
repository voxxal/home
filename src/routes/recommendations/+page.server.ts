import { recommendations } from "$lib/data/recommendations";
import { error } from "@sveltejs/kit";

export const load = async () => {
  try {
    return { recommendations };
  } catch (_) {
    throw error(404, "Not found");
  }
};
