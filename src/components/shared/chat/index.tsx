import { useEffect, useMemo, useState } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { Grid } from 'antd';
import { ChatConversation } from './ChatConversation';
import { useGetChatRoomsQuery } from '../../../redux/apiSlices/chatSlice';
import Spinner from '../../../components/shared/Spinner';
import { socketUrl } from '../../../redux/api/baseApi';
import { io } from 'socket.io-client';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';

export default function ChatLayout() {
    const { data: userData } = useProfileQuery({});
    const user = userData?.data;
    const { lg } = Grid.useBreakpoint();
    const [activeRoom, setActiveRoom] = useState<any>(null);
    const [messageId, setMessageId] = useState<string | null>(null);
    const { data, isLoading, refetch } = useGetChatRoomsQuery(undefined);
    const chatRooms = data?.data || [];
    // console.log(chatRooms);

    const socket = useMemo(() => io(`${socketUrl}?userId=${user?._id}`), []);

    useEffect(() => {
        socket.on(`newChat`, (data) => {
            refetch();
            console.log(data, 'socket chat room');

            // setMessages((prev) => [...prev, { ...data, sender: { _id: data?.sender?._id } }]);
        });
    }, [socket, user?._id]);

    // Default to the first room on desktop
    useEffect(() => {
        if (lg && !messageId && chatRooms.length > 0) {
            setActiveRoom(chatRooms[0]);
            setMessageId(chatRooms[0]._id);
        }
    }, [lg, messageId]);

    const selectRoom = (room: any) => {
        setActiveRoom(room);
        setMessageId(room._id);
    };

    if (isLoading) {
        return <Spinner />;
    }

    // Mobile view logic
    if (!lg) {
        if (messageId) {
            const selectedRoom = chatRooms.find((r: any) => r._id === messageId) || chatRooms[0];
            return (
                <div className="h-[calc(100vh-120px)] flex flex-col p-4">
                    <button
                        onClick={() => setMessageId(null)}
                        className="mb-4 text-[#055E6E] font-medium flex items-center gap-2"
                    >
                        ← Back to Messages
                    </button>
                    <div className="flex-1 overflow-hidden">
                        <ChatConversation activeUser={selectedRoom} messageId={messageId} />
                    </div>
                </div>
            );
        }
        return (
            <div className="p-4">
                <ChatSidebar messageId={null} onSelect={selectRoom} chatRooms={chatRooms} />
            </div>
        );
    }

    // Desktop view
    return (
        <div className="flex gap-6 h-[calc(100vh-210px)] ">
            <div className="w-[320px] shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-y-auto">
                <ChatSidebar messageId={messageId} onSelect={selectRoom} chatRooms={chatRooms} />
            </div>
            <div className="grow">
                <ChatConversation messageId={messageId} activeUser={activeRoom} />
            </div>
        </div>
    );
}
