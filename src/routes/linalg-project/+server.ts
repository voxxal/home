export async function GET({ fetch, url }) {
  url.pathname = "/linalg-project/index.html";
  return await fetch(url);
}
