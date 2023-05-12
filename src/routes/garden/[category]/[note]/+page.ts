import { error } from "@sveltejs/kit";

export const load = async ({ params }) => {
  try {
    const post = await import(`../../notes/${params.category}/${params.note}.svelte`);
    const { title, lastUpdated } = post.metadata;
    const content = post.default;
  
    return {
      content,
      title,
      lastUpdated,
    };
  } catch (_) {
    throw error(404, 'Not found');
  }
};
