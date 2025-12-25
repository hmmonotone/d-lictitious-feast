export default {
    async fetch(request: Request, env: any): Promise<Response> {
      const url = new URL(request.url);
  
      // ---------- API ROUTES ----------
      if (url.pathname.startsWith("/api/")) {
        if (url.pathname === "/api/posts") {
          // Example response (replace with D1 logic later)
          return Response.json({
            posts: [],
          });
        }
  
        return new Response("Not Found", { status: 404 });
      }
  
      // ---------- STATIC ASSETS ----------
      if (!env.ASSETS) {
        return new Response(
          "ASSETS binding missing. Check wrangler.toml",
          { status: 500 }
        );
      }
  
      // Try serving the asset
      let res = await env.ASSETS.fetch(request);
  
      // ---------- SPA FALLBACK ----------
      if (res.status === 404) {
        url.pathname = "/index.html";
        res = await env.ASSETS.fetch(new Request(url.toString(), request));
      }
  
      return res;
    },
  };
  