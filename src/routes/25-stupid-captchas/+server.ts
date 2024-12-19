import { redirect } from "@sveltejs/kit";

export const trailingSlash = "always";

export async function GET({ fetch, url }) {
  if (url.pathname[url.pathname.length - 1] != "/") throw redirect(308, "/25-stupid-captchas/");
  url.pathname = "/25-stupid-captchas/index.html";
  return await fetch(url);
}
