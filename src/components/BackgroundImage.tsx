import React from 'react';
import Image from 'next/image';

interface BackgroundImageProps {
    children: React.ReactNode;
    src?: string; // allow overriding background image
    priority?: boolean; // allow marking as high priority (landing page)
    quality?: number; // image quality for large backgrounds
    alt?: string;
}

export default function BackgroundImage({ children, src = '/bg_hero.png', priority = false, quality = 70, alt = 'Background' }: BackgroundImageProps) {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Optimized background image */}
            <Image
                src={src}
                alt={alt}
                fill
                sizes="100vw"
                priority={priority}
                quality={quality}
                className="object-cover pointer-events-none select-none"
            />

            {/* Content */}
            <div className="relative z-20 min-h-screen">
                {children}
            </div>
        </div>
    );
}
