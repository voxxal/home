import { browser } from "$app/environment";
import { format } from "date-fns";
import { convert } from "html-to-text";
import { readFileSync } from "fs";
import { join } from "path";
import { INIT_CWD } from "$env/static/private";

// we require some server-side APIs to parse all metadata
if (browser) {
  throw new Error(`posts can only be imported server-side`);
}

// Get all posts and add metadata
export const posts = Object.entries(
  import.meta.glob("/src/routes/blog/posts/**/*.svelte", { eager: true })
)
  .map(([filepath, post]) => {
    const html = readFileSync(join(INIT_CWD, filepath)).toString();
    const defaultLayout = post.metadata.defaultLayout ?? true;
    const text = convert(html, {
      baseElements: { selectors: ["p", "ul", "li"] },
    });
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
      wordCount: text.split(/\w/).length,
      readingTime: Math.max(text.split(/\w/).length, 255) / 255,
      preview: text.substring(0, 65 * 4) + (text.length > 65 * 4 ? "..." : ""),
    };
  })
  .filter((post) => !post?.hidden)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

function addTimezoneOffset(date) {
  const offsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000;
  return new Date(new Date(date).getTime() + offsetInMilliseconds);
}
