import { LuMapPin, LuClock, LuMessageSquare, LuMail, LuBriefcase, LuUsers, LuPhone } from 'react-icons/lu';

export const MentorSidebar = ({ mentor, handleChat }: { mentor: any; handleChat: any }) => (
    <div className="lg:col-span-5 space-y-6">
        {/* About Section */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 space-y-6">
            <section>
                <h2 className="text-xl font-bold text-[#1E293B] mb-3">About</h2>
                <p className="text-[#64748B] text-base leading-relaxed">
                    {mentor?.about || "Not provided"}
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-[#1E293B] mb-4">
                    Professional Background
                </h3>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[#8B5CF6]">
                        <LuMail size={18} />
                        <span className="text-sm font-medium">{mentor.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#64748B]">
                        <LuPhone className="text-[#8B5CF6]" size={18} />
                        <span>{mentor?.mobileNumber || "Not provided"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[#64748B]">
                        <LuMapPin className="text-[#8B5CF6]" size={18} />
                        <span>{mentor?.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[#64748B]">
                        <LuBriefcase className="text-[#8B5CF6]" size={18} />
                        <span>{mentor?.company}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[#64748B]">
                        <LuClock className="text-[#8B5CF6]" size={18} />
                        <span>{mentor?.status}</span>
                    </div>

                    {/* Assigned Group */}
                    <div className="flex items-center gap-3 text-[#64748B]">
                        <LuUsers className="text-[#8B5CF6]" size={18} />
                        <span>
                            {mentor?.userGroup?.[0]?.name}
                            {mentor?.userGroupTrack?.name &&
                                ` (${mentor.userGroupTrack.name})`}
                        </span>
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
        </div>


    </div>
);
