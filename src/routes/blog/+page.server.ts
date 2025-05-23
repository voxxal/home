import { posts } from "$lib/data/posts";
import { error } from "@sveltejs/kit";

export const load = async ({ params }) => {
  try {
    return { posts: posts.filter((post) => !post?.hidden) };
  } catch (_) {
    throw error(404, "Not found");
  }
};
