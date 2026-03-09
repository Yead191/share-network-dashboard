import { LuMapPin, LuClock, LuMessageSquare, LuMail, LuUser, LuCalendar, LuBriefcase } from 'react-icons/lu';

export const MentorSidebar = ({ mentor, handleChat }: { mentor: any; handleChat: any }) => (
    <div className="lg:col-span-5 space-y-6">
        {/* About Section */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 space-y-6">
            <section>
                <h2 className="text-xl font-bold text-[#1E293B] mb-3">About</h2>
                <p className="text-[#64748B] text-base leading-relaxed">
                    Your mentor will share more about their background and experience soon.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-[#1E293B] mb-4">Professional Background</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[#64748B]">
                        <LuMapPin className="text-[#8B5CF6]" size={18} />
                        <span>{mentor.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#64748B]">
                        <LuBriefcase className="text-[#8B5CF6]" size={18} />
                        <span>{mentor.specialization}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#64748B]">
                        <LuClock className="text-[#8B5CF6]" size={18} />
                        <span>{mentor.availability}</span>
                    </div>
                </div>
            </section>

            <button
                onClick={() => handleChat(mentor._id)}
                className="w-full flex items-center justify-center gap-2 border border-[#3BB77E] text-[#3BB77E] py-3 rounded-xl font-semibold hover:bg-[#3BB77E]/5 transition-colors"
            >
                <LuMessageSquare size={18} />
                Send Message
            </button>

            {/* Session Scheduling Card */}
            <div className="bg-[#EBF5FB] p-5 rounded-2xl border border-[#D6EAF8]">
                <div className="flex items-center gap-2 text-[#2E86C1] font-bold mb-2">
                    <LuCalendar size={18} />
                    <span>Session Scheduling</span>
                </div>
                <p className="text-[#5499C7] text-sm">
                    Session scheduling feature coming soon! For now, use messages to coordinate meetings.
                </p>
            </div>
        </div>

        {/* Contact & Professional Links */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-[#1E293B] mb-2">Contact & Professional Links</h2>
            <p className="text-[#94A3B8] text-sm mb-6 font-medium">Primary Contact</p>

            <div className="space-y-4">
                <div className="bg-[#EBF5FB] p-4 rounded-xl border border-[#D6EAF8] flex items-center gap-3 text-[#2E86C1] font-semibold text-sm">
                    <LuMessageSquare size={18} />
                    <span>Platform Messages (Recommended)</span>
                </div>
                <div className="flex items-center gap-3 text-[#8B5CF6] pl-2">
                    <LuMail size={18} />
                    <span className="text-sm font-medium">{mentor.email}</span>
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <p className="text-lg font-bold text-[#1E293B] mb-4">Additional Information</p>
                    <div className="flex items-center gap-3 text-[#64748B] pl-2 font-medium text-sm">
                        <LuUser size={18} className="text-[#8B5CF6]" />
                        <span>Mentor Profile</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
