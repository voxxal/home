import { posts } from "$lib/data/posts";
import { error } from "@sveltejs/kit";

export const load = async ({ params }) => {
  try {
    return { posts }
  } catch (_) {
    throw error(404, "Not found");
  }
};
