export default {
    async fetch(request: Request, env: any): Promise<Response> {
      let res = await env.ASSETS.fetch(request);
  
      if (res.status === 404) {
        const url = new URL(request.url);
        url.pathname = "/index.html";
        res = await env.ASSETS.fetch(new Request(url.toString(), request));
      }
  
      return res;
    },
  };
  