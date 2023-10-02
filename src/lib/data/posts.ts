import { browser } from "$app/environment";
import { format } from "date-fns";

// we require some server-side APIs to parse all metadata
if (browser) {
  throw new Error(`posts can only be imported server-side`);
}

// Get all posts and add metadata
export const posts = Object.entries(
  import.meta.glob("/src/routes/blog/posts/**/*.svelte", { eager: true })
)
  .map(([filepath, post]) => {
    console.log(filepath);
    return {
      ...post.metadata,

      // generate the slug from the file path
      path: filepath
        .replace(/(\/index)?\.svelte/, "")
        .split("/")
        .pop(),

      // format date as yyyy-MM-dd
      date: post.metadata.published
        ? format(
            // offset by timezone so that the date is correct
            addTimezoneOffset(new Date(post.metadata.published)),
            "yyyy-MM-dd"
          )
        : undefined,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

function addTimezoneOffset(date) {
  const offsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000;
  return new Date(new Date(date).getTime() + offsetInMilliseconds);
}
