"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageViewTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Debounce: skip if we already notified for this path in this tab session
        const storageKey = `pv_notified_${pathname}`;
        if (sessionStorage.getItem(storageKey)) return;
        sessionStorage.setItem(storageKey, '1');

        // Gather tracking parameters
        const params = new URLSearchParams(window.location.search);
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const isMobile = screenWidth < 768;
        const isTablet = screenWidth >= 768 && screenWidth < 1024;
        const deviceType = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';

        const payload = {
            page: window.location.href,
            tracking: {
                utm_source: params.get('utm_source') || null,
                utm_medium: params.get('utm_medium') || null,
                utm_campaign: params.get('utm_campaign') || null,
                utm_term: params.get('utm_term') || null,
                utm_content: params.get('utm_content') || null,
                referrer: document.referrer || null,
                screen: `${screenWidth}x${screenHeight}`,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                device_type: deviceType,
            },
        };

        // Fire-and-forget — don't block the user
        fetch('/api/page-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }).catch(() => { /* silently ignore */ });
    }, [pathname]);

    return null; // This component renders nothing
}
