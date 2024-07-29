export const trailingSlash = "always";

export async function GET({ fetch, url }) {
  url.pathname = "/25-stupid-captchas/index.html";
  return await fetch(url);
}
