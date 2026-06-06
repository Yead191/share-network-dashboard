import { LuCalendar } from 'react-icons/lu';

export const MentorJourney = () => (
    <div className="bg-white p-8 rounded-2xl border border-gray-100">
        <h2 className="text-xl font-bold text-[#1E293B] mb-8">Your Learning Journey Together</h2>

        <div className="space-y-5">
            {/* Card 1 - Blue */}
            <div className="bg-[#EBF5FB] p-5 rounded-2xl border border-[#D6EAF8]">
                <h4 className="text-[#2E86C1] font-bold mb-2">Getting Started</h4>
                <p className="text-[#5499C7] text-sm leading-relaxed">
                    Your mentor is here to guide you through your learning journey. Don't hesitate to reach out with
                    questions, share your progress, or ask for advice on your career path.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Card 2 - Purple */}
                <div className="bg-[#F5EEFB] p-5 rounded-2xl border border-[#E8DAEF]">
                    <div className="flex items-center gap-2 text-[#8E44AD] font-bold mb-2">
                        <LuCalendar size={18} />
                        <span>Ask Questions</span>
                    </div>
                    <p className="text-[#AF7AC5] text-xs">
                        Use the chat below to ask about concepts, get clarification, or seek guidance on projects.
                    </p>
                </div>
                {/* Card 3 - Orange */}
                <div className="bg-[#FEF5E7] p-5 rounded-2xl border border-[#FDEBD0]">
                    <div className="flex items-center gap-2 text-[#D35400] font-bold mb-2">
                        <LuCalendar size={18} />
                        <span>Share Progress</span>
                    </div>
                    <p className="text-[#E67E22] text-xs">
                        Keep your mentor updated on what you're learning and any challenges you're facing.
                    </p>
                </div>
            </div>
        </div>
    </div>
);
