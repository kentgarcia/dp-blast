import { useState } from 'react';
import { UserInfo, Status } from '@/types';

interface QuestionnaireProps {
    onSubmit: (userInfo: UserInfo) => void;
    onBack: () => void;
}

export default function Questionnaire({ onSubmit, onBack }: QuestionnaireProps) {
    const [formData, setFormData] = useState({
        name: '',
        section: '',
        status: '' as Status | ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.section && formData.status) {
            onSubmit({
                name: formData.name,
                section: formData.section,
                status: formData.status as Status
            });
        }
    };

    const isValid = formData.name && formData.section && formData.status;

    return (
        <div 
            className="min-h-screen relative overflow-hidden bg-cover bg-center bg-fixed"
            style={{ backgroundImage: 'url(/bg_hero.png)' }}
        >
            {/* Overlay for better content readability */}
            <div className="absolute inset-0 bg-blue-900/20 z-0"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-blue-900/80"></div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/30">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            EXPLICIT DP Blast
                        </h1>
                        <p className="text-white/90">
                            Create your custom profile picture with your academic status frame
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none transition text-white placeholder-white/70"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="section" className="block text-sm font-medium text-white mb-2">
                                Section
                            </label>
                            <select
                                id="section"
                                value={formData.section}
                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none transition text-white"
                                required
                            >
                                <option value="" className="text-gray-800">Select your section</option>
                                <option value="BSIT 1-1" className="text-gray-800">BSIT 1-1</option>
                                <option value="BSIT 1-2" className="text-gray-800">BSIT 1-2</option>
                                <option value="BSIT 2-1" className="text-gray-800">BSIT 2-1</option>
                                <option value="BSIT 2-2" className="text-gray-800">BSIT 2-2</option>
                                <option value="BSIT 3-1" className="text-gray-800">BSIT 3-1</option>
                                <option value="BSIT 3-2" className="text-gray-800">BSIT 3-2</option>
                                <option value="BSIT 4-1" className="text-gray-800">BSIT 4-1</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-white mb-2">
                                Academic Status
                            </label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none transition text-white"
                                required
                            >
                                <option value="" className="text-gray-800">Select your status</option>
                                <option value="freshman" className="text-gray-800">Freshman</option>
                                <option value="sophomore" className="text-gray-800">Sophomore</option>
                                <option value="junior" className="text-gray-800">Junior</option>
                                <option value="senior" className="text-gray-800">Senior</option>
                            </select>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex-1 py-3 px-4 border border-white/30 rounded-lg font-medium text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={!isValid}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all backdrop-blur-sm ${isValid
                                    ? 'bg-white/20 hover:bg-white/30 text-white shadow-md hover:shadow-lg border border-white/30'
                                    : 'bg-gray-500/20 text-gray-300 cursor-not-allowed border border-gray-500/30'
                                    }`}
                            >
                                Continue to Upload Photo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}