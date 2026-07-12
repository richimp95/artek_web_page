import type { APIRoute } from 'astro';

const isPages = (process.env.DEPLOY_TARGET ?? 'ftp') === 'pages';

export const GET: APIRoute = ({ site }) => {
  const body = isPages
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
