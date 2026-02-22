import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/', // Block API routes from being indexed
        },
        sitemap: 'https://www.pekkerai.com/sitemap.xml', // Custom domain
    };
}
