'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { UserInfo, ImagePosition } from '@/types';

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

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = uploadedImage;
            });

            setUserImageLoaded(img);
        };

        loadUserImage().catch(console.error);
    }, [uploadedImage]);

    useEffect(() => {
        const loadFrameImage = async () => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            try {
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = getFrameUrl();
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
            // Draw user image with current position and scale
            const scaledWidth = imagePosition.width * imagePosition.scale;
            const scaledHeight = imagePosition.height * imagePosition.scale;

            ctx.drawImage(
                userImageLoaded,
                imagePosition.x,
                imagePosition.y,
                scaledWidth,
                scaledHeight
            );

            // Draw frame on top
            ctx.drawImage(frameImageLoaded, 0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

        } catch (error) {
            console.error('Error drawing preview:', error);
        }
    }, [userImageLoaded, frameImageLoaded, imagePosition]);

    // Draw preview whenever images or position changes
    useEffect(() => {
        if (userImageLoaded && frameImageLoaded) {
            drawPreview();
        }
    }, [drawPreview]);

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
            const highResX = imagePosition.x * SCALE_RATIO;
            const highResY = imagePosition.y * SCALE_RATIO;
            const highResWidth = imagePosition.width * imagePosition.scale * SCALE_RATIO;
            const highResHeight = imagePosition.height * imagePosition.scale * SCALE_RATIO;

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

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        const rect = previewCanvasRef.current?.getBoundingClientRect();
        if (rect) {
            setDragStart({
                x: e.clientX - rect.left - imagePosition.x,
                y: e.clientY - rect.top - imagePosition.y,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const rect = previewCanvasRef.current?.getBoundingClientRect();
        if (rect) {
            const newX = e.clientX - rect.left - dragStart.x;
            const newY = e.clientY - rect.top - dragStart.y;

            onPositionUpdate({
                ...imagePosition,
                x: newX,
                y: newY,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleScaleChange = (scale: number) => {
        onPositionUpdate({
            ...imagePosition,
            scale,
        });
    };

    useEffect(() => {
        drawPreview();
    }, [uploadedImage, userInfo.status, imagePosition]);

    return (
        <div
            className="min-h-screen relative overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: 'url(/bg_hero.png)' }}
        >
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-4xl border border-white/30">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Adjust Your EXPLICIT DP
                        </h1>
                        <p className="text-white/90">
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
                                    className="w-full h-full cursor-move"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                />
                            </div>

                            {/* Size Control */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Image Size: {Math.round(imagePosition.scale * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="3"
                                    step="0.1"
                                    value={imagePosition.scale}
                                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
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
                                        value={imagePosition.x}
                                        onChange={(e) => onPositionUpdate({
                                            ...imagePosition,
                                            x: parseInt(e.target.value)
                                        })}
                                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
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
                                        value={imagePosition.y}
                                        onChange={(e) => onPositionUpdate({
                                            ...imagePosition,
                                            y: parseInt(e.target.value)
                                        })}
                                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Info and Actions */}
                        <div className="flex-1 space-y-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <h3 className="font-semibold text-white mb-2">Your Details</h3>
                                <p className="text-sm text-white/90">
                                    <span className="font-medium">Name:</span> {userInfo.name}
                                </p>
                                <p className="text-sm text-white/90">
                                    <span className="font-medium">Section:</span> {userInfo.section}
                                </p>
                                <p className="text-sm text-white/90">
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
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 mt-4">
                                    <h3 className="text-sm font-semibold text-white mb-2">Your Caption:</h3>
                                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded p-3 text-sm text-white mb-3">
                                        What&apos;s up, Explorers! I&apos;m {userInfo.name} from {userInfo.section}, and I&apos;m ready to kick off this semester as a proud BSIT student here at 𝗣𝗼𝗹𝘆𝘁𝗲𝗰𝗵𝗻𝗶𝗰 𝗨𝗻𝗶𝘃𝗲𝗿𝘀𝗶𝘁𝘆 𝗼𝗳 𝘁𝗵𝗲 𝗣𝗵𝗶𝗹𝗶𝗽𝗽𝗶𝗻𝗲𝘀 – 𝗦𝗮𝗻 𝗣𝗲𝗱𝗿𝗼 𝗖𝗮𝗺𝗽𝘂𝘀.
                                        <br /><br />
                                        A new chapter begins, and I&apos;m all set to face the challenges, embrace the opportunities, and make the most out of every moment this semester has to offer. Here&apos;s to growth, learning, and memories worth keeping as we continue this BSIT journey together.
                                    </div>
                                    <button
                                        onClick={() => {
                                            const caption = `What\'s up, Explorers! I\'m ${userInfo.name} from ${userInfo.section}, and I\'m ready to kick off this semester as a proud BSIT student here at 𝗣𝗼𝗹𝘆𝘁𝗲𝗰𝗵𝗻𝗶𝗰 𝗨𝗻𝗶𝘃𝗲𝗿𝘀𝗶𝘁𝘆 𝗼𝗳 𝘁𝗵𝗲 𝗣𝗵𝗶𝗹𝗶𝗽𝗽𝗶𝗻𝗲𝘀 – 𝗦𝗮𝗻 𝗣𝗲𝗱𝗿𝗼 𝗖𝗮𝗺𝗽𝘂𝘀.

A new chapter begins, and I\'m all set to face the challenges, embrace the opportunities, and make the most out of every moment this semester has to offer. Here\'s to growth, learning, and memories worth keeping as we continue this BSIT journey together.`;
                                            navigator.clipboard.writeText(caption);
                                            toast.success('Caption copied to clipboard! 📋', {
                                                duration: 2000,
                                            });
                                        }}
                                        className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors backdrop-blur-sm border border-white/30"
                                    >
                                        📋 Copy Caption
                                    </button>
                                </div>

                                <button
                                    onClick={onBack}
                                    className="w-full py-3 px-4 border border-white/30 rounded-lg font-medium text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
                                >
                                    Upload Different Photo
                                </button>

                                <button
                                    onClick={onStartOver}
                                    className="w-full py-2 px-4 text-sm text-white/80 hover:text-white transition-colors"
                                >
                                    Start Over with New Info
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
