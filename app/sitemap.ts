import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://pekeerai-seo.vercel.app'; // Change to absolute domain when you buy one e.g. https://pekkerai.com

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        // Add more URLs here as your app grows
        // {
        //   url: `${baseUrl}/blog`,
        //   lastModified: new Date(),
        //   changeFrequency: 'daily',
        //   priority: 0.8,
        // }
    ];
}
