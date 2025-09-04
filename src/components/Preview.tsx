'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { UserInfo, ImagePosition } from '@/types';
import BackgroundImage from './BackgroundImage';

// Simple RAF throttle for draw calls
function useRafThrottle(callback: () => void) {
    const rafId = useRef<number | null>(null);
    const queued = useRef(false);
    const tick = useCallback(() => {
        queued.current = false;
        callback();
        rafId.current = null;
    }, [callback]);
    const request = useCallback(() => {
        if (rafId.current == null && !queued.current) {
            queued.current = true;
            rafId.current = requestAnimationFrame(tick);
        }
    }, [tick]);
    useEffect(() => () => {
        if (rafId.current != null) cancelAnimationFrame(rafId.current);
    }, []);
    return request;
}

interface PreviewProps {
    userInfo: UserInfo;
    uploadedImage: string;
    imagePosition: ImagePosition;
    onPositionUpdate: (position: ImagePosition) => void;
    onBack: () => void;
    onStartOver: () => void;
}

export default function Preview({ userInfo, uploadedImage, imagePosition, onPositionUpdate, onBack, onStartOver }: PreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isExporting, setIsExporting] = useState(false);
    const initializedRef = useRef(false);

    // Local UI state for immediate, smooth movement
    const [localScale, setLocalScale] = useState(imagePosition.scale);
    const [localX, setLocalX] = useState(imagePosition.x);
    const [localY, setLocalY] = useState(imagePosition.y);

    // Push updates to parent sparingly (on interaction end)
    const commitPosition = useCallback((next: { x?: number; y?: number; scale?: number }) => {
        onPositionUpdate({
            ...imagePosition,
            x: next.x ?? imagePosition.x,
            y: next.y ?? imagePosition.y,
            scale: next.scale ?? imagePosition.scale,
        });
    }, [imagePosition, onPositionUpdate]);

    // Cache loaded images to prevent re-loading on every position change
    const [userImageLoaded, setUserImageLoaded] = useState<HTMLImageElement | null>(null);
    const [frameImageLoaded, setFrameImageLoaded] = useState<HTMLImageElement | null>(null);

    const frameMap = {
        freshman: '/frames/freshman-frame.png',
        sophomore: '/frames/sophomore-frame.png',
        junior: '/frames/junior-frame.png',
        senior: '/frames/senior-frame.png',
    };

    const fallbackFrameMap = {
        freshman: '/frames/freshman-frame.svg',
        sophomore: '/frames/sophomore-frame.svg',
        junior: '/frames/junior-frame.svg',
        senior: '/frames/senior-frame.svg',
    };

    const getFrameUrl = () => {
        return frameMap[userInfo.status];
    };

    const getFallbackFrameUrl = () => {
        return fallbackFrameMap[userInfo.status];
    };

    // Build an optimized URL using Next.js image optimizer for fast preview
    const getOptimizedUrl = (url: string, width: number, quality = 70) => {
        // Next.js image optimizer route works for public assets as well
        const params = new URLSearchParams({ url, w: String(width), q: String(quality) });
        return `/_next/image?${params.toString()}`;
    };

    // High-resolution dimensions (3000x3000)
    const HIGH_RES_SIZE = 3000;
    // Preview dimensions (400x400)
    const PREVIEW_SIZE = 400;
    const SCALE_RATIO = HIGH_RES_SIZE / PREVIEW_SIZE;

    // Load images once when component mounts or images change
    useEffect(() => {
        const loadUserImage = async () => {
            if (!uploadedImage) return;

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.decoding = 'async';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = uploadedImage;
            });

            // Initialize preserving aspect ratio (cover the square) and center once
            if (!initializedRef.current) {
                const coverScale = Math.max(PREVIEW_SIZE / img.width, PREVIEW_SIZE / img.height);
                const baseWidth = Math.round(img.width * coverScale);
                const baseHeight = Math.round(img.height * coverScale);
                const centeredX = Math.round((PREVIEW_SIZE - baseWidth) / 2);
                const centeredY = Math.round((PREVIEW_SIZE - baseHeight) / 2);

                setLocalScale(1);
                setLocalX(centeredX);
                setLocalY(centeredY);
                onPositionUpdate({
                    ...imagePosition,
                    width: baseWidth,
                    height: baseHeight,
                    x: centeredX,
                    y: centeredY,
                    scale: 1,
                });
                initializedRef.current = true;
            }

            setUserImageLoaded(img);
        };

        loadUserImage().catch(console.error);
    }, [uploadedImage]);

    useEffect(() => {
        const loadFrameImage = async () => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.decoding = 'async';
            // Use smaller, optimized frame for preview canvas
            const optimizedUrl = getOptimizedUrl(getFrameUrl(), PREVIEW_SIZE, 70);

            try {
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = optimizedUrl;
                });
            } catch (error) {
                // Fallback to SVG if PNG not found
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = getFallbackFrameUrl();
                });
            }

            setFrameImageLoaded(img);
        };

        loadFrameImage().catch(console.error);
    }, [userInfo.status]);

    // Optimized draw function that uses cached images
    const drawPreview = useCallback(async () => {
        const canvas = previewCanvasRef.current;
        if (!canvas || !userImageLoaded || !frameImageLoaded) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = PREVIEW_SIZE;
        canvas.height = PREVIEW_SIZE;

        // Clear canvas
        ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

        try {
            // Draw user image with current position and scale (preserve aspect via base width/height)
            const scaledWidth = (imagePosition.width || PREVIEW_SIZE) * localScale;
            const scaledHeight = (imagePosition.height || PREVIEW_SIZE) * localScale;

            ctx.drawImage(
                userImageLoaded,
                localX,
                localY,
                scaledWidth,
                scaledHeight
            );

            // Draw frame on top
            ctx.drawImage(frameImageLoaded, 0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

        } catch (error) {
            console.error('Error drawing preview:', error);
        }
    }, [userImageLoaded, frameImageLoaded, imagePosition.width, imagePosition.height, localScale, localX, localY]);

    const scheduleDraw = useRafThrottle(drawPreview);

    // Draw preview whenever images or position changes
    useEffect(() => {
        if (userImageLoaded && frameImageLoaded) {
            scheduleDraw();
        }
    }, [scheduleDraw, userImageLoaded, frameImageLoaded]);

    const exportHighRes = async () => {
        setIsExporting(true);

        try {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = HIGH_RES_SIZE;
            canvas.height = HIGH_RES_SIZE;

            // Clear canvas
            ctx.clearRect(0, 0, HIGH_RES_SIZE, HIGH_RES_SIZE);

            // Load and draw user image at high resolution
            const userImg = new Image();
            userImg.crossOrigin = 'anonymous';

            await new Promise((resolve, reject) => {
                userImg.onload = resolve;
                userImg.onerror = reject;
                userImg.src = uploadedImage;
            });

            // Scale up the position and dimensions for high-res export
            const highResX = localX * SCALE_RATIO;
            const highResY = localY * SCALE_RATIO;
            const highResWidth = (imagePosition.width || PREVIEW_SIZE) * localScale * SCALE_RATIO;
            const highResHeight = (imagePosition.height || PREVIEW_SIZE) * localScale * SCALE_RATIO;

            ctx.drawImage(
                userImg,
                highResX,
                highResY,
                highResWidth,
                highResHeight
            );

            // Load and draw frame at high resolution with fallback
            const frameImg = new Image();
            frameImg.crossOrigin = 'anonymous';

            try {
                await new Promise((resolve, reject) => {
                    frameImg.onload = resolve;
                    frameImg.onerror = reject;
                    frameImg.src = getFrameUrl();
                });
            } catch (error) {
                // Fallback to SVG if PNG not found
                await new Promise((resolve, reject) => {
                    frameImg.onload = resolve;
                    frameImg.onerror = reject;
                    frameImg.src = getFallbackFrameUrl();
                });
            }

            // Draw frame on top
            ctx.drawImage(frameImg, 0, 0, HIGH_RES_SIZE, HIGH_RES_SIZE);

            // Export as high-resolution PNG
            const link = document.createElement('a');
            link.download = `${userInfo.name.replace(/\s+/g, '_')}_${userInfo.status}_dp.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();

            toast.success('High-resolution image downloaded! 🎉', {
                duration: 3000,
            });

        } catch (error) {
            console.error('Error exporting image:', error);
            toast.error('Failed to export image. Please try again.', {
                duration: 4000,
            });
        } finally {
            setIsExporting(false);
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        const rect = previewCanvasRef.current?.getBoundingClientRect();
        if (rect) {
            setDragStart({
                x: e.clientX - rect.left - localX,
                y: e.clientY - rect.top - localY,
            });
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;

        const rect = previewCanvasRef.current?.getBoundingClientRect();
        if (rect) {
            const newX = e.clientX - rect.left - dragStart.x;
            const newY = e.clientY - rect.top - dragStart.y;
            setLocalX(newX);
            setLocalY(newY);
            scheduleDraw();
        }
    };

    const handlePointerUp = () => {
        setIsDragging(false);
        // Commit final position
        commitPosition({ x: localX, y: localY });
    };

    const handleScaleChange = (scale: number) => {
        setLocalScale(scale);
        scheduleDraw();
    };

    const handleXChange = (x: number) => {
        setLocalX(x);
        scheduleDraw();
    };

    const handleYChange = (y: number) => {
        setLocalY(y);
        scheduleDraw();
    };

    useEffect(() => {
        scheduleDraw();
    }, [uploadedImage, userInfo.status, scheduleDraw]);

    const statusLabel = userInfo.status.charAt(0).toUpperCase() + userInfo.status.slice(1);

    return (
        <BackgroundImage>
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="bg-black/60 md:bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-4xl border border-white/30">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mb-2">
                            Adjust Your EXPLICIT DP
                        </h1>
                        <p className="text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                            Drag to move your photo, use the slider to resize, then export in high resolution
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Hidden high-res canvas */}
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Preview and Controls */}
                        <div className="flex-1">
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-6 relative">
                                <canvas
                                    ref={previewCanvasRef}
                                    width={PREVIEW_SIZE}
                                    height={PREVIEW_SIZE}
                                    className="w-full h-full cursor-move touch-none"
                                    onPointerDown={(e) => {
                                        (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
                                        handlePointerDown(e);
                                    }}
                                    onPointerMove={(e) => handlePointerMove(e)}
                                    onPointerUp={(e) => {
                                        (e.currentTarget as HTMLCanvasElement).releasePointerCapture(e.pointerId);
                                        handlePointerUp();
                                    }}
                                    onPointerCancel={handlePointerUp}
                                />
                            </div>

                            {/* Size Control */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Image Size: {Math.round(localScale * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="3"
                                    step="0.01"
                                    value={localScale}
                                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                                    className="w-full h-3 bg-white/80 rounded-lg appearance-none cursor-pointer slider !transition-none"
                                    style={{
                                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((localScale - 0.5) / (3 - 0.5)) * 100}%, rgba(255,255,255,0.3) ${((localScale - 0.5) / (3 - 0.5)) * 100}%, rgba(255,255,255,0.3) 100%)`
                                    }}
                                />
                            </div>

                            {/* Position Controls */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        X Position
                                    </label>
                                    <input
                                        type="range"
                                        min="-200"
                                        max="200"
                                        value={localX}
                                        onChange={(e) => handleXChange(parseInt(e.target.value))}
                                        className="w-full h-3 bg-white/80 rounded-lg appearance-none cursor-pointer slider !transition-none"
                                        style={{
                                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((localX + 200) / 400) * 100}%, rgba(255,255,255,0.3) ${((localX + 200) / 400) * 100}%, rgba(255,255,255,0.3) 100%)`
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        Y Position
                                    </label>
                                    <input
                                        type="range"
                                        min="-200"
                                        max="200"
                                        value={localY}
                                        onChange={(e) => handleYChange(parseInt(e.target.value))}
                                        className="w-full h-3 bg-white/80 rounded-lg appearance-none cursor-pointer slider !transition-none"
                                        style={{
                                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((localY + 200) / 400) * 100}%, rgba(255,255,255,0.3) ${((localY + 200) / 400) * 100}%, rgba(255,255,255,0.3) 100%)`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Info and Actions */}
                        <div className="flex-1 space-y-6">
                            <div className="bg-black/30 md:bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                                <h3 className="font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] mb-2">Your Details</h3>
                                <p className="text-sm text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                                    <span className="font-medium">Name:</span> {userInfo.name}
                                </p>
                                <p className="text-sm text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                                    <span className="font-medium">Section:</span> {userInfo.section}
                                </p>
                                <p className="text-sm text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                                    <span className="font-medium">Status:</span> {userInfo.status.charAt(0).toUpperCase() + userInfo.status.slice(1)}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={exportHighRes}
                                    disabled={isExporting}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${isExporting
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    {isExporting ? 'Downloading...' : 'Download DP'}
                                </button>

                                {/* Caption Section */}
                                <div className="bg-black/50 md:bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 mt-4">
                                    <h3 className="text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] mb-2">Your Caption:</h3>
                                    <div className="bg-white/20 md:bg-white/20 backdrop-blur-sm border border-white/30 rounded p-3 text-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] mb-3 whitespace-pre-wrap">
                                        {`Initializing… ⚙️💻🔧

I'm ${userInfo.name}, a ${statusLabel} Bachelor of Science in Information Technology student at Polytechnic University of the Philippines – San Pedro Campus. Here at PUP, we're more than just students—we're builders, problem-solvers, and visionaries shaping tomorrow's digital world.

This year, let's write better code, craft smarter solutions, and chase bigger dreams. Together, we'll take on challenges, spark innovation, and push the limits of what's possible.

Frame: Jhayciel Santiago
Caption: Jenmarc Ronquillo`}
                                    </div>
                                    <button
                                        onClick={() => {
                                            const caption = `Initializing… ⚙️💻🔧

I'm ${userInfo.name}, a ${statusLabel} Bachelor of Science in Information Technology student at Polytechnic University of the Philippines – San Pedro Campus. Here at PUP, we're more than just students—we're builders, problem-solvers, and visionaries shaping tomorrow's digital world.

This year, let's write better code, craft smarter solutions, and chase bigger dreams. Together, we'll take on challenges, spark innovation, and push the limits of what's possible.

Frame: Jhayciel Santiago
Caption: Jenmarc Ronquillo`;
                                            navigator.clipboard.writeText(caption);
                                            toast.success('Caption copied to clipboard! 📋', {
                                                duration: 2000,
                                            });
                                        }}
                                        className="w-full py-2 px-4 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors backdrop-blur-sm border border-white/40"
                                    >
                                        📋 Copy Caption
                                    </button>
                                </div>

                                <button
                                    onClick={onBack}
                                    className="w-full py-3 px-4 border border-white/40 rounded-lg font-semibold text-white hover:bg-white/15 transition-colors backdrop-blur-sm"
                                >
                                    Upload Different Photo
                                </button>

                                <button
                                    onClick={onStartOver}
                                    className="w-full py-2 px-4 text-sm text-white/90 hover:text-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                                >
                                    Start Over with New Info
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BackgroundImage>
    );
}
