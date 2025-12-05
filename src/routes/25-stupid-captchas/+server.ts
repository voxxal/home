import { redirect } from "@sveltejs/kit";

export const trailingSlash = "always";

export async function GET({ fetch, url }) {
  if (!url.pathname.endsWith("/")) {
    throw redirect(308, "/25-stupid-captchas/");
  }

  url.pathname = "/25-stupid-captchas/index.html";
  
  const response = await fetch(url);

  const newHeaders = new Headers(response.headers);
  newHeaders.delete("content-encoding");
  newHeaders.delete("content-length");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
