'use client';

import { useState, useRef } from 'react';
import { UserInfo } from '@/types';
import BackgroundImage from './BackgroundImage';

interface ImageUploadProps {
    userInfo: UserInfo;
    onImageUpload: (imageUrl: string) => void;
    onBack: () => void;
}

export default function ImageUpload({ userInfo, onImageUpload, onBack }: ImageUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                onImageUpload(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <BackgroundImage>
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="bg-black/60 md:bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg border border-white/30">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mb-2">
                            Upload Your Photo
                        </h1>
                        <div className="bg-black/30 md:bg-white/10 backdrop-blur-md rounded-lg p-4 mb-4 border border-white/20">
                            <p className="text-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                                <span className="font-semibold">Name:</span> {userInfo.name}
                            </p>
                            <p className="text-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                                <span className="font-semibold">Section:</span> {userInfo.section}
                            </p>
                            <p className="text-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                                <span className="font-semibold">Status:</span> {userInfo.status.charAt(0).toUpperCase() + userInfo.status.slice(1)}
                            </p>
                        </div>
                        <p className="text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                            Upload a clear photo of yourself for your custom DP
                        </p>
                    </div>

                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={openFileDialog}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all backdrop-blur-sm ${dragActive
                            ? 'border-white/80 bg-white/20'
                            : 'border-white/60 hover:border-white/80 hover:bg-white/10'
                            }`}
                    >
                        <div className="flex flex-col items-center">
                            <svg
                                className="w-12 h-12 text-white/70 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <p className="text-lg font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] mb-2">
                                Drop your photo here or click to browse
                            </p>
                            <p className="text-sm text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                                Supports JPG, PNG, and other image formats
                            </p>
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                    />

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onBack}
                            className="appearance-none flex-1 py-3 px-4 border border-white/40 rounded-lg font-semibold text-white bg-black/60 hover:bg-black/70 transition-colors backdrop-blur-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </BackgroundImage>
    );
}