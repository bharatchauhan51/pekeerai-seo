import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/', // Block API routes from being indexed
        },
        sitemap: 'https://pekeerai-seo.vercel.app/sitemap.xml', // Change to your custom domain
    };
}
