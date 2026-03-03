import { Card, Button } from 'antd';
import { MessageSquare, Eye } from 'lucide-react';

import { imageUrl } from '../../../../redux/api/baseApi';
import { useState } from 'react';
import StudentProfileModal from '../../../../components/modals/mentor/StudentProfileModal';
import { useNavigate } from 'react-router-dom';
import { useCreateChatRoomMutation } from '../../../../redux/apiSlices/chatSlice';
import { toast } from 'sonner';

const StudentProfile = ({ student }: { student: any }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // create chat room
    const [createChatRoom] = useCreateChatRoomMutation();

    const handleChat = async (id: string) => {
        toast.promise(
            createChatRoom({
                participants: [id],
            }),
            {
                loading: 'Creating chat room...',
                success: (res) => {
                    // console.log(res);
                    navigate(`/mentor/chat`);
                    return res?.data?.message || 'Chat room created successfully';
                },
                error: (err) => {
                    return err?.data?.message || 'Failed to create chat room';
                },
            },
        );
    };

    return (
        <Card className="shadow-sm border-none rounded-2xl ">
            <div className="flex flex-col items-center">
                <div className="relative mb-2">
                    <img
                        src={imageUrl + student?.profile}
                        alt="Student"
                        className="w-24 h-24 rounded-full border-4 border-white shadow-sm object-cover"
                    />
                </div>
                <h2 className="text-[16px] text-center font-semibold text-gray-800 mb-1">
                    {student?.firstName + ' ' + student?.lastName}
                </h2>
                <p className="text-gray-500  font-medium mb-6">{student?.email}</p>

                <div className="flex gap-4 w-full">
                    <Button
                        onClick={() => handleChat(student?._id)}
                        icon={<MessageSquare className="w-4 h-4 " />}
                        className="flex-1 h-11 rounded-xl flex items-center justify-center border-gray-200 text-gray-600 hover:text-primary transition-colors"
                    >
                        Chat
                    </Button>
                    <Button
                        icon={<Eye className="w-4 h-4" />}
                        className="flex-1 h-11 rounded-xl flex items-center justify-center border-gray-200 text-gray-600 hover:text-primary transition-colors"
                        onClick={() => setIsModalOpen(true)}
                    >
                        View
                    </Button>
                </div>
            </div>

            <StudentProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} student={student} />
        </Card>
    );
};

export default StudentProfile;
