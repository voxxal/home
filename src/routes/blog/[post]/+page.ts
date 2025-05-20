import { error } from "@sveltejs/kit";

export const load = async ({
  data: {
    post: {
      project,
      file,
      manifest: { readingTime },
    },
  },
}) => {
  try {
    const post = project
      ? await import(`../posts/${project}/${file}.svelte`)
      : await import(`../posts/${file}.svelte`);
    const { title, published, layout = "full" } = post.metadata;
    const content = post.default;

    return {
      content,
      title,
      published,
      layout,
      readingTime,
    };
  } catch (_) {
    console.log(_);
    throw error(404, "Not found");
  }
};
