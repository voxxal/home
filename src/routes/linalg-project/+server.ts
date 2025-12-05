    
export async function GET({ fetch, url }) {
  url.pathname = "/linalg-project/index.html";
  
  const response = await fetch(url);

  const newHeaders = new Headers(response.headers);
  
  newHeaders.delete('content-encoding');
  newHeaders.delete('content-length');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

