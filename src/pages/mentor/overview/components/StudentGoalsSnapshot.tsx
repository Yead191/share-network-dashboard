import { GraduationCap, Heart, Laptop, Search, Brain, Quote } from 'lucide-react';
import { getImageUrl } from '../../../../utils/getImageUrl';

interface Goal {
    _id: string;
    title: string;
    description: string;
    isActive: boolean;
}

interface Onboarding {
    _id: string;
    computer_comfort: string[];
    curious_activities: string[];
    hardest_to_learn: string[];
    proud_moment: string;
}

interface StudentSnapshot {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    profile: string;
    Goals: Goal[];
    Onboarding: Onboarding;
}

const StudentGoalsSnapshot = ({ snapshots }: { snapshots: StudentSnapshot[] }) => {
    if (!snapshots || snapshots.length === 0) {
        return (
            <div className="rounded-xl border border-gray-100 shadow-sm h-full bg-white p-6 flex flex-col items-center justify-center text-gray-400">
                <GraduationCap size={48} className="mb-2 opacity-20" />
                <p>No student snapshots available</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-100 shadow-md h-full bg-white overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="p-2 bg-blue-500 rounded-lg text-white">
                        <GraduationCap size={20} />
                    </div>
                    Student Goals Snapshot
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {snapshots?.map((student, index) => (
                    <div key={student?._id} className="relative">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                                <img
                                    src={student?.profile ? `${getImageUrl(student.profile)}` : '/default-avatar.png'}
                                    alt={`${student.firstName} ${student.lastName}`}
                                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-gray-100"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'https://ui-avatars.com/api/?name=' +
                                            student.firstName +
                                            '+' +
                                            student.lastName +
                                            '&background=ebf4ff&color=3b82f6';
                                    }}
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 leading-tight">
                                    {student?.firstName} {student?.lastName}
                                </h4>
                                <p className="text-sm text-gray-500 font-medium">{student?.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                                <div className="flex items-center gap-2 text-slate-600 mb-2">
                                    <Laptop size={16} className="text-blue-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Computer Comfort</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {student?.Onboarding?.computer_comfort?.join(', ') || 'Not specified'}
                                </p>
                            </div>

                            <div className="bg-rose-50 rounded-xl p-4 border border-rose-100/50">
                                <div className="flex items-center gap-2 text-rose-600 mb-2">
                                    <Search size={16} className="text-rose-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Curiosities</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {student?.Onboarding?.curious_activities?.join(', ') || 'Not specified'}
                                </p>
                            </div>

                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100/50">
                                <div className="flex items-center gap-2 text-amber-600 mb-2">
                                    <Brain size={16} className="text-amber-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        Learning Challenges
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {student?.Onboarding?.hardest_to_learn?.join(', ') || 'Not specified'}
                                </p>
                            </div>

                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100/50">
                                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                    <Quote size={16} className="text-emerald-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Proud Moment</span>
                                </div>
                                <p className="text-sm text-gray-700 italic leading-relaxed">
                                    "{student?.Onboarding?.proud_moment || 'No proud moment shared yet'}"
                                </p>
                            </div>
                        </div>

                        {student?.Goals && student?.Goals?.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-1">
                                    <Heart size={16} className="text-red-500 fill-red-500" />
                                    <span className="text-sm font-bold text-gray-800">Active Goals</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {student?.Goals?.map((goal) => (
                                        <div
                                            key={goal?._id}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 shadow-sm"
                                        >
                                            {goal?.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {index < snapshots.length - 1 && (
                            <div className="mt-8 border-b border-dashed border-gray-200" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentGoalsSnapshot;
