'use client';

import Image from 'next/image';

interface LandingPageProps {
    onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
    return (
        <div
            className="min-h-screen relative overflow-hidden bg-cover bg-center bg-fixed"
            style={{ backgroundImage: 'url(/bg_hero.png)' }}
        >
            {/* Overlay for better content readability */}
            <div className="absolute inset-0 bg-blue-900/20 z-0"></div>

            {/* Gradient Overlay for better text readability */}
            <div className="fixed inset-0 bg-gradient-to-b from-blue-900/60 to-blue-900/80 z-5"></div>

            {/* Content Overlay */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
                {/* Logo */}
                <div className="mb-8">
                    <Image
                        src="/logo_explicit.png"
                        alt="EXPLICIT Logo"
                        width={200}
                        height={200}
                        className="w-auto h-32 md:h-40 lg:h-48"
                        priority
                    />
                </div>

                {/* Main Text */}
                <div className="text-center text-white mb-8 max-w-4xl">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                        EXPLORERS IN COMMUNICATION AND INFORMATION TECHNOLOGY
                    </h1>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 text-blue-200">
                        HOME OF THE ORIGINAL CHAMPIONS
                    </h2>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-medium mb-8">
                        Welcome, EXPLORERS!
                    </h3>
                </div>

                {/* Get Started Button */}
                <button
                    onClick={onGetStarted}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20"
                >
                    Create Your DP Blast
                </button>

                {/* Additional Info */}
                <p className="text-white/90 text-sm md:text-base mt-6 text-center max-w-2xl">
                    Upload your photo, add your information, and create your personalized display picture with your status frame.
                </p>
            </div>
        </div>
    );
}
