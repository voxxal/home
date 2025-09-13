import { browser } from "$app/environment";
import { format } from "date-fns";
import { convert } from "html-to-text";

// we require some server-side APIs to parse all metadata
if (browser) {
  throw new Error(`posts can only be imported server-side`);
}

interface Post {
  metadata: {
    published: string;
    hidden?: boolean;
  };
}

const postsSources = import.meta.glob("/src/routes/blog/posts/**/*.svelte", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Get all posts and add metadata
export const posts = Object.entries(
  import.meta.glob("/src/routes/blog/posts/**/*.svelte", { eager: true })
)
  .map(([filepath, post]: [string, any]) => {
    const postPath = filepath.substring("/src/routes/blog/posts/".length).split("/");
    if (postPath.length > 1 && postPath.pop() !== "index.svelte") return null;

    const html = (postsSources[filepath] as string).toString(); // TODO its kinda hard to find the file path actually
    // TODO write your own lol, it really shouldn't be that hard.
    const text = convert(html, {
      baseElements: { selectors: ["p", "ul", "li"] },
    });
    return {
      ...post.metadata,
      filepath,

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
  .filter((post) => post)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const splitPath = (path: string) => {
  const parts = path.split("/");
  if (parts.length > 1) return { project: parts[0], file: parts[1] };
  else return { project: null, file: parts[0] };
};

export const postsMap = Object.fromEntries(
  posts.map((post) => [
    post.path,
    {
      ...splitPath(
        post.filepath.substring("/src/routes/blog/posts/".length).replace(".svelte", "")
      ),
      manifest: post,
    },
  ])
);

function addTimezoneOffset(date: Date) {
  const offsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000;
  return new Date(new Date(date).getTime() + offsetInMilliseconds);
}
