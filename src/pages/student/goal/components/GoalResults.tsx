import React from 'react';
import { PiTargetLight } from 'react-icons/pi';
import HeaderTitle from '../../../../components/shared/HeaderTitle';
import { useProfileQuery } from '../../../../redux/apiSlices/authSlice';
import GoalBanner from './GoalBanner';

const GoalResults: React.FC = () => {
    const { data: profileData, isLoading } = useProfileQuery(undefined);

    const woopGoals = profileData?.data?.woop || [];
    const mainGoals = profileData?.data?.Goals || [];
    const userName = profileData?.data?.firstName || 'Student';

    if (isLoading) return <div className="p-10 text-center text-gray-400">Loading profile...</div>;

    return (
        <div className="space-y-10 animate-fadeIn">

            <GoalBanner name={userName} />

            <section className="space-y-4">
                <HeaderTitle title="Your Goals" />
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    {mainGoals.map((goal: any) => (
                        <div
                            key={goal._id}
                            className="w-full flex items-center space-x-4 p-5 rounded-xl border border-[#3BB77E] bg-[#EBF9F1]/30 transition-all"
                        >
                            <div className="bg-[#3BB77E] p-2 rounded-lg">
                                <PiTargetLight className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#1E1E1E] text-base">{goal.title}</h3>
                                <p className="text-sm text-[#6B7280]">{goal.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Individual WOOP Strategies Section */}
            <section className="space-y-6">
                <div className="flex items-center space-x-2 px-2">
                    <div className="w-2 h-6 bg-[#8B5CF6] rounded-full"></div>
                    <h2 className="text-xl font-bold text-[#1E1E1E]">Formulated Strategies (WOOP)</h2>
                </div>
                
                {woopGoals.map((woop: any, index: number) => (
                    <div key={woop._id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center space-x-2">
                             <span className="text-xs font-bold text-[#8B5CF6] bg-[#F5F3FF] px-3 py-1 rounded-full border border-[#8B5CF6]/20">
                                STRATEGY #{index + 1}
                             </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* WISH */}
                            <div className="bg-[#FAF5FF] p-6 rounded-2xl border-l-4 border-[#8B5CF6] shadow-sm">
                                <h3 className="text-[#8B5CF6] font-bold uppercase tracking-widest text-[10px] mb-3">WISH</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">{woop.wish?.detail}</p>
                            </div>

                            {/* OUTCOME */}
                            <div className="bg-[#F0F9FF] p-6 rounded-2xl border-l-4 border-[#3B82F6] shadow-sm">
                                <h3 className="text-[#3B82F6] font-bold uppercase tracking-widest text-[10px] mb-3">OUTCOME</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">{woop.outcome?.detail}</p>
                            </div>

                            {/* OBSTACLE */}
                            <div className="bg-[#FFF7ED] p-6 rounded-2xl border-l-4 border-[#F97316] shadow-sm">
                                <h3 className="text-[#F97316] font-bold uppercase tracking-widest text-[10px] mb-3">OBSTACLE</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">{woop.obstacle?.detail}</p>
                            </div>

                            {/* PLAN */}
                            <div className="bg-[#F0FDF4] p-6 rounded-2xl border-l-4 border-[#22C55E] shadow-sm">
                                <h3 className="text-[#22C55E] font-bold uppercase tracking-widest text-[10px] mb-3">PLAN</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">{woop.plan?.detail}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default GoalResults;