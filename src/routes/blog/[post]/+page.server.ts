import { postsMap } from "$lib/data/posts.js";
import { error } from "@sveltejs/kit";


export const load = async ({ params }) => {
  try {
    return { post: postsMap[params.post] };
  } catch (_) {
    throw error(404, "Not found");
  }
};
