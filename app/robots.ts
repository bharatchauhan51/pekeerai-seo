import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: '/api/', // Block API routes from being indexed
            },
            {
                userAgent: ['OAI-SearchBot', 'ChatGPT-User'],
                allow: '/',
            }
        ],
        sitemap: 'https://pekkerai.com/sitemap.xml', // Custom domain
    };
}
