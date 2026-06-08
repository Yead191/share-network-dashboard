import { useState } from 'react';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import Spinner from '../../../components/shared/Spinner';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import { Target, CheckCircle2, Trophy } from 'lucide-react';
import { useGetMentorWoopsQuery } from '../../../redux/apiSlices/mentor/mentorWoops';
import WoopList from '../../mentor/woops/components/WoopList';
import WoopDetailsModal from '../../mentor/woops/components/WoopDetailsModal';

interface GoalData {
    _id: string;
    title: string;
    description: string;
}

const WoopsTab = ({ profileData }: { profileData: any }) => {
    const { data: woopsRes, isLoading } = useGetMentorWoopsQuery(profileData?.data?._id, { skip: !profileData?.data?._id });
    const [viewingWoop, setViewingWoop] = useState<any | null>(null);

    // console.log(woopsRes)
    if (isLoading) return <Spinner />;

    return (
        <div className="animate-fadeIn mt-2">
            <WoopList
                woops={woopsRes?.data || []}
                onView={setViewingWoop}
                readOnly={true}
            />
            <WoopDetailsModal
                visible={!!viewingWoop}
                woop={viewingWoop}
                onClose={() => setViewingWoop(null)}
                readOnly={true}
            />
        </div>
    );
};

export default function GoalIndex() {
    const { data: profileData, isLoading } = useProfileQuery(undefined);
    const [activeTab, setActiveTab] = useState<'goal' | 'woop'>('goal');

    // Fallback array representing typical structure if api data is undefined
    const goals: GoalData[] = profileData?.data?.Goals || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner />
            </div>
        );
    }

    // Helper to get diverse icons/colors based on index
    const getCardTheme = (index: number) => {
        const themes = [
            { icon: <Target size={24} className="text-[#3B82F6]" />, bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]' },
            { icon: <Trophy size={24} className="text-[#8B5CF6]" />, bg: 'bg-[#F5F3FF]', border: 'border-[#DDD6FE]' },
            {
                icon: <CheckCircle2 size={24} className="text-[#10B981]" />,
                bg: 'bg-[#ECFDF5]',
                border: 'border-[#A7F3D0]',
            },
        ];
        return themes[index % themes.length];
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col gap-6">
                <div>
                    <HeaderTitle title="My Goals & WOOPs" />
                    <p className="text-[#64748B] text-sm mt-1">Track your long-term objectives and actionable steps.</p>
                </div>

                {/* Tabs Navigation */}
                <div className="flex gap-4 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('goal')}
                        className={`px-6 py-3 font-semibold text-base transition-all border-b-2 ${activeTab === 'goal'
                            ? 'border-[#7C3AED] text-[#7C3AED]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Goals
                    </button>
                    <button
                        onClick={() => setActiveTab('woop')}
                        className={`px-6 py-3 font-semibold text-base transition-all border-b-2 ${activeTab === 'woop'
                            ? 'border-[#7C3AED] text-[#7C3AED]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        My WOOPs
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'goal' && (
                <div className="animate-fadeIn">
                    {goals?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {goals?.map((goal, index) => {
                                const theme = getCardTheme(index);
                                const steps = goal.description.split('\n').filter((step) => step.trim() !== '');

                                return (
                                    <div
                                        key={goal._id}
                                        className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group"
                                    >
                                        <div className="p-6 border-b border-gray-50 flex items-start gap-4">
                                            <div
                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${theme.bg} ${theme.border} border group-hover:scale-110 transition-transform duration-300`}
                                            >
                                                {theme.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-[#1E293B] leading-tight">{goal.title}</h3>
                                        </div>

                                        <div className="p-6 flex-1 bg-gray-50/30">
                                            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-4">
                                                Focus Areas
                                            </p>
                                            <ul className="space-y-4">
                                                {steps.map((step, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1] shrink-0 mt-2"></span>
                                                        <span className="text-[#475569] text-sm leading-relaxed">{step}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Target size={32} className="text-[#94A3B8]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1E293B] mb-2">No Goals Found</h3>
                            <p className="text-[#64748B] max-w-sm mx-auto">
                                It looks like you haven't been assigned any goals yet. Check back later or complete your
                                onboarding!
                            </p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'woop' && <WoopsTab profileData={profileData} />}
        </div>
    );
}
