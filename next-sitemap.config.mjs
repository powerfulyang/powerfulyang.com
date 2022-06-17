/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://powerfulyang.com',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap-index.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://powerfulyang.com/server-sitemap-index.xml', // <==== Add here
    ],
  },
};

export default config;
