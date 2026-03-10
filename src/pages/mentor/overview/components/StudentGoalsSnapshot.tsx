import { GraduationCap, Target, Sparkles, BookOpen, BrainCircuit, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../../../../utils/getImageUrl';

interface Goal {
    _id: string;
    title: string;
    description: string;
    isActive: boolean;
}

interface Onboarding {
    _id: string;
    computer_comfort: string;
    curious_activities: string;
    hardest_to_learn: string;
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
            <div className="rounded-2xl border border-gray-100 shadow-xl h-full bg-white p-12 flex flex-col items-center justify-center text-gray-300">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                    <GraduationCap size={64} className="opacity-20 text-gray-400" />
                </div>
                <p className="text-lg font-medium">No student data available</p>
                <p className="text-sm">Assigned students will appear here</p>
            </div>
        );
    }

    const goalIcons = [
        <Target className="text-indigo-500" size={18} />,
        <BookOpen className="text-emerald-500" size={18} />,
        <BrainCircuit className="text-amber-500" size={18} />,
    ];

    const goalGradients = ['from-indigo-50/50 to-white', 'from-emerald-50/50 to-white', 'from-amber-50/50 to-white'];

    const goalBorders = [
        'border-indigo-100/50 hover:border-indigo-300',
        'border-emerald-100/50 hover:border-emerald-300',
        'border-amber-100/50 hover:border-amber-300',
    ];

    return (
        <div className="rounded-[2rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] h-full bg-white overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-8 py-7 border-b border-gray-50 bg-gradient-to-r from-gray-50/80 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-100 text-white transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Target size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Student Success</h3>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Growth Tracking</p>
                    </div>
                </div>
                <div className="flex -space-x-3">
                    {snapshots.length > 3 && (
                        <div className="w-10 h-10 rounded-full border-4 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm ring-1 ring-gray-100">
                            +{snapshots.length - 3}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
                {snapshots?.map((student, studentIndex) => (
                    <div key={student?._id} className="relative group/student">
                        {/* Student Info Card */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-200 rounded-3xl blur-md opacity-20 group-hover/student:opacity-40 transition-opacity"></div>
                                    <img
                                        src={
                                            student?.profile ? `${getImageUrl(student.profile)}` : '/default-avatar.png'
                                        }
                                        alt={`${student.firstName} ${student.lastName}`}
                                        className="relative w-16 h-16 rounded-[1.25rem] object-cover border-2 border-white shadow-xl ring-1 ring-gray-50"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=f3f4f6&color=6366f1&bold=true&rounded=true`;
                                        }}
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full shadow-lg" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 group-hover/student:text-indigo-600 transition-colors">
                                        {student?.firstName} {student?.lastName}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-gray-400 font-medium">{student?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2.5 rounded-xl text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all">
                                <Sparkles size={18} />
                            </button>
                        </div>

                        {/* Goals Section */}
                        <div className="grid grid-cols-1 gap-5 pl-4 border-l-2 border-gray-50 relative">
                            {student?.Goals && student?.Goals?.length > 0 ? (
                                student.Goals.slice(0, 3).map((goal, goalIndex) => (
                                    <div
                                        key={goal?._id}
                                        className={`group/goal p-5 bg-gradient-to-br ${goalGradients[goalIndex] || 'from-gray-50 to-white'} rounded-[1.5rem] border ${goalBorders[goalIndex] || 'border-gray-100'} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
                                    >
                                        <div className="absolute -right-2 -bottom-4 text-7xl font-black text-black/[0.03] italic pointer-events-none group-hover/goal:scale-110 transition-transform">
                                            {goalIndex + 1}
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-2xl bg-white shadow-sm border border-gray-50 flex items-center justify-center group-hover/goal:scale-110 transition-transform duration-300">
                                                {goalIcons[goalIndex] || (
                                                    <ChevronRight size={18} className="text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                                        Goal {goalIndex + 1}
                                                    </span>
                                                </div>
                                                <h5 className="text-base font-black text-gray-800 mb-2 leading-tight">
                                                    {goal?.title}
                                                </h5>
                                                <p className="text-[12px] text-gray-500 leading-relaxed font-medium line-clamp-2">
                                                    {goal?.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                    <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm border border-gray-100 mb-3 text-gray-300">
                                        <Sparkles size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 tracking-tight">No Active Goals</p>
                                </div>
                            )}
                        </div>

                        {studentIndex < snapshots.length - 1 && (
                            <div className="mt-16 mb-8 flex items-center gap-4">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-100"></div>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Viewing {snapshots?.[0]?.firstName} {snapshots?.[0]?.lastName}'s Success Pathways
                </p>
            </div>
        </div>
    );
};

export default StudentGoalsSnapshot;
