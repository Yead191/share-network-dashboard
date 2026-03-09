import { useNavigate } from 'react-router-dom';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import { MentorHeader } from './components/MentorHeader';
import { MentorSidebar } from './components/MentorSidebar';
import { MentorJourney } from './components/MentorJourney';
import { Empty } from 'antd';
import { useCreateChatRoomMutation } from '../../../redux/apiSlices/chatSlice';
import { toast } from 'sonner';
import { getImageUrl } from '../../../utils/getImageUrl';

export default function Mentor() {
    const navigate = useNavigate();
    const { data: profileData } = useProfileQuery(
        {},
        { selectFromResult: ({ data }) => ({ data: data?.data || data }) },
    );
    // create chat room
    const [createChatRoom] = useCreateChatRoomMutation();

    // Extract mentor from student profile
    const mentorRaw = profileData?.mentorId;
    // console.log(mentorRaw);
    // Format mentor for UI
    const formattedMentor = mentorRaw
        ? {
              ...mentorRaw,
              profile: getImageUrl(mentorRaw.profile),
              role: 'Mentor',
              subtext: 'Guiding you towards success',
              location: mentorRaw.address || 'Not provided',
              specialization: mentorRaw.jobTitle || 'Not provided',
              availability: 'Available',
          }
        : null;

    const handleChat = async (id: string) => {
        toast.promise(
            createChatRoom({
                participants: [id],
            }),
            {
                loading: 'Creating chat room...',
                success: (res) => {
                    console.log(res);
                    navigate(`/student/chat`);
                    return res?.data?.message || 'Chat room created successfully';
                },
                error: (err) => {
                    return err?.data?.message || 'Failed to create chat room';
                },
            },
        );
    };

    if (!formattedMentor) return <Empty description="No mentor assigned yet" />;

    return (
        <section className="space-y-6 overflow-hidden">
            <MentorHeader mentor={formattedMentor} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <MentorSidebar mentor={formattedMentor} handleChat={handleChat} />
                <div className="lg:col-span-7 space-y-6">
                    <MentorJourney />
                    {/* <MentorChat
                        messages={messages}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        onSendMessage={handleSendMessage}
                    /> */}
                </div>
            </div>
            {/* Contact & Professional Links */}
        </section>
    );
}
