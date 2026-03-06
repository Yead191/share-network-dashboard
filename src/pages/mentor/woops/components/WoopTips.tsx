import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { tipsData } from '../../../../constants/mentor-data';

interface WoopTipsProps {
    onReset: () => void;
}

const WoopTips: React.FC<WoopTipsProps> = ({ onReset }) => {
    return (
        <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
            {/* <h2 className="text-xl font-semibold mb-6">Tips for Effective WOOP</h2> */}

            <div className="bg-[#1E4E8C] text-white p-8 rounded-2xl mb-6 relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-white/20 p-3 rounded-lg">
                        <FiPlus className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Master Your Goals</h3>
                        <p className="text-white/80 mt-1">
                            Use these expert tips to make your WOOP sessions more impactful.
                        </p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            </div>

            <div className="space-y-4">
                {tipsData.map((tip, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                        <div className="bg-blue-50 p-3 rounded-xl h-fit">
                            <tip.icon className="text-blue-500 text-xl" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-800">{tip.title}</h4>
                            <p className="text-gray-500 mt-1">{tip.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="my-6 rounded-2xl overflow-hidden shadow-lg aspect-[16/9] w-full bg-gray-100">
                <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/DpbCMzQqZAU?si=KmhniMF_ghlHEvYU"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>
            </div>

            <button
                onClick={onReset}
                className="w-full mt-10 bg-[#22C55E] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-100"
            >
                Start New WOOP
            </button>
        </div>
    );
};

export default WoopTips;
