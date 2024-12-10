import { posts } from "$lib/data/posts"
export const get = async () => {
  const body = render(posts);
  const headers = {
    "Cache-Control": `max-age=0, s-max-age=${600}`,
    "Content-Type": "application/xml",
  };
  return {
    body,
    headers,
  };
};

const render = (posts: any[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<atom:link href="https://voxal.dev/rss" rel="self" type="application/rss+xml" />
<title>Aiden Shi</title>
<link>https://voxal.dev/</link>
<description>tomfoolery sometimes</description>
${posts
  .map(
    (post) => `<item>
<guid>https://voxal.dev/blog/${post.path}</guid>
<title>${post.title}</title>
<link>https://www.davidwparker.com/blog/${post.path}</link>
<description>${post.description}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`
  )
  .join("")}
</channel>
</rss>
`;
