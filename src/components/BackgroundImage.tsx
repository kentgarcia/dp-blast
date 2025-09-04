import React from 'react';

interface BackgroundImageProps {
    children: React.ReactNode;
}

export default function BackgroundImage({ children }: BackgroundImageProps) {
    return (
        <div
            className="min-h-screen relative overflow-hidden"
            style={{
                backgroundImage: 'url(/bg_hero.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Content */}
            <div className="relative z-20 min-h-screen">
                {children}
            </div>
        </div>
    );
}
