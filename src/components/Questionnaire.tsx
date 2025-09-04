import { useState } from 'react';
import BackgroundImage from './BackgroundImage';
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
        <BackgroundImage>
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="bg-white/15 md:bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md border border-white/30">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mb-2">
                            EXPLICIT DP Blast
                        </h1>
                        <p className="text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
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
                                className="w-full px-4 py-3 bg-white/95 md:bg-white/90 border border-white/60 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-gray-900 placeholder-gray-500"
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
                                className="w-full px-4 py-3 bg-white/95 md:bg-white/90 border border-white/60 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-gray-900"
                                required
                            >
                                <option value="" className="text-gray-600 bg-white">Select your section</option>
                                <option value="BSIT 1-1" className="text-gray-900 bg-white">BSIT 1-1</option>
                                <option value="BSIT 1-2" className="text-gray-900 bg-white">BSIT 1-2</option>
                                <option value="BSIT 2-1" className="text-gray-900 bg-white">BSIT 2-1</option>
                                <option value="BSIT 2-2" className="text-gray-900 bg-white">BSIT 2-2</option>
                                <option value="BSIT 3-1" className="text-gray-900 bg-white">BSIT 3-1</option>
                                <option value="BSIT 3-2" className="text-gray-900 bg-white">BSIT 3-2</option>
                                <option value="BSIT 4-1" className="text-gray-900 bg-white">BSIT 4-1</option>
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
                                className="w-full px-4 py-3 bg-white/95 md:bg-white/90 border border-white/60 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-gray-900"
                                required
                            >
                                <option value="" className="text-gray-600 bg-white">Select your status</option>
                                <option value="freshman" className="text-gray-900 bg-white">Freshman</option>
                                <option value="sophomore" className="text-gray-900 bg-white">Sophomore</option>
                                <option value="junior" className="text-gray-900 bg-white">Junior</option>
                                <option value="senior" className="text-gray-900 bg-white">Senior</option>
                            </select>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex-1 py-3 px-4 border border-white/40 rounded-lg font-semibold text-white hover:bg-white/15 transition-colors backdrop-blur-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={!isValid}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all backdrop-blur-sm ${isValid
                                    ? 'bg-blue-600/90 hover:bg-blue-600 text-white shadow-md hover:shadow-lg border border-white/40'
                                    : 'bg-gray-500/30 text-gray-200 cursor-not-allowed border border-gray-500/40'
                                    }`}
                            >
                                Continue to Upload Photo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </BackgroundImage>
    );
}