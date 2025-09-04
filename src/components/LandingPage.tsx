'use client';

import Image from 'next/image';
import BackgroundImage from './BackgroundImage';

interface LandingPageProps {
    onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
    return (
        <BackgroundImage priority>

            {/* Content Overlay */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8">
                {/* Logo */}
                <div className="mb-8">
                    <Image
                        src="/logo_explicit.png"
                        alt="EXPLICIT Logo"
                        width={200}
                        height={200}
                        sizes="(max-width: 768px) 8rem, (max-width: 1024px) 10rem, 12rem"
                        className="w-auto h-32 md:h-40 lg:h-48"
                        priority
                    />
                </div>

                {/* Main Text */}
                <div className="text-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mb-8 max-w-4xl">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
                        EXPLORERS IN COMMUNICATION AND INFORMATION TECHNOLOGY
                    </h1>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 text-blue-100">
                        HOME OF THE ORIGINAL CHAMPIONS
                    </h2>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-8">
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
                <p className="text-white/90 text-sm md:text-base mt-6 text-center max-w-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    Upload your photo, add your information, and create your personalized display picture with your status frame.
                </p>

                {/* Credits */}
                <div className="absolute bottom-4 right-4 text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] text-xs">
                    <p>Website: Kent</p>
                    <p>DP Frame: Jhayciel Santiago</p>
                </div>
            </div>
        </BackgroundImage>
    );
}
