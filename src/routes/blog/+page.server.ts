import { posts } from "$lib/data/posts.js";
import { error } from "@sveltejs/kit";

export const load = async ({ params }) => {
  try {
    console.log(posts)
    return { posts }
  } catch (_) {
    throw error(404, "Not found");
  }
};
