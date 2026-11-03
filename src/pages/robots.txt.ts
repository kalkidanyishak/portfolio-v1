import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://resume-aby.pages.dev');
  const sitemap = new URL('/sitemap.xml', origin);

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemap.toString()}\n`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
};
