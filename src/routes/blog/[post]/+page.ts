import { error } from "@sveltejs/kit";

export const load = async ({ params }) => {
  try {
    const post = await import(`../posts/${params.post}.svelte`);
    const { title, published, defaultLayout = true } = post.metadata;
    const content = post.default;

    return {
      content,
      title,
      published,
      defaultLayout,
    };
  } catch (_) {
    throw error(404, "Not found");
  }
};
