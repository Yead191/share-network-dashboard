import { LuClock } from 'react-icons/lu';
import { Assignment, AssignmentStatus } from '../../../../constants/student/assignments';

interface AssignmentCardProps {
    assignment: Assignment;
    onClick: (assignment: Assignment) => void;
    effectiveStatus: AssignmentStatus;
}

export const AssignmentCard = ({ assignment, onClick, effectiveStatus }: AssignmentCardProps) => {
    return (
        <div
            onClick={() => onClick(assignment)}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
        >
            <div className="flex items-start gap-4">
                <div
                    style={{ backgroundColor: assignment.color }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                />
                <div className="flex-1 min-w-0 pr-16 text-left">
                    <p className="text-[10px] font-bold text-[#94A3B8] tracking-wider mb-1 uppercase">
                        {assignment.subject}
                    </p>
                    <h3 className="text-xl font-bold text-[#1E293B] mb-2 truncate">{assignment.title}</h3>
                    {assignment.userGroup && assignment.userGroup.length > 0 && (
                        <p className="text-[10px] font-bold text-[#3BB77E] tracking-wider mb-2 uppercase">
                            Group: {assignment.userGroup.map((g) => g.name).join(', ')}
                        </p>
                    )}
                    <p className="text-[#64748B] text-sm leading-relaxed line-clamp-2">{assignment.description}</p>
                </div>
                <div className="absolute top-6 right-6">
                    <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                            effectiveStatus === 'COMPLETED'
                                ? 'bg-[#DCFCE7] text-[#3BB77E]'
                                : 'bg-[#F8FAFC] text-[#94A3B8]'
                        }`}
                    >
                        {effectiveStatus}
                    </span>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <div className="flex items-center gap-1.5 text-[#94A3B8] text-[10px] font-medium uppercase">
                    <LuClock size={12} />
                    <span>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                        {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </div>
    );
};
