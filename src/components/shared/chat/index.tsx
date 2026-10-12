import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatSidebar } from './ChatSidebar';
import { Grid } from 'antd';
import { ChatConversation } from './ChatConversation';
import { useGetChatRoomsQuery, useCreateChatRoomMutation } from '../../../redux/apiSlices/chatSlice';
import Spinner from '../../../components/shared/Spinner';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import { getSocket } from '../../../utils/socket';
import NewChatModal from '../../modals/chat/NewChatModal';
import { toast } from 'sonner';

export default function ChatLayout() {
    const { data: userData } = useProfileQuery({});
    const user = userData?.data;
    const { lg } = Grid.useBreakpoint();

    const [searchParams, setSearchParams] = useSearchParams();
    const queryChatId = searchParams.get('chatId') || searchParams.get('id');
    const queryUserId = searchParams.get('userId');

    const [activeRoom, setActiveRoom] = useState<any>(null);
    const [messageId, setMessageId] = useState<string | null>(queryChatId);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, refetch } = useGetChatRoomsQuery(undefined);
    const [createChatRoom, { isLoading: isCreatingChatRoom }] = useCreateChatRoomMutation();

    const chatRooms = data?.data || [];
    const chatRoomIds = chatRooms.map((r: any) => r._id).join(',');

    // Socket listener for new incoming chat rooms
    useEffect(() => {
        if (!user?._id) return;
        const socket = getSocket(user._id);

        const handleNewChat = () => {
            refetch();
        };

        socket.on('newChat', handleNewChat);
        return () => {
            socket.off('newChat', handleNewChat);
        };
    }, [user?._id, refetch]);

    // Synchronize selected conversation with URL query parameters & chat room list
    useEffect(() => {
        if (!chatRooms || chatRooms.length === 0) return;

        // 1. If URL specifies a chatId
        if (queryChatId) {
            const matchedRoom = chatRooms.find((r: any) => String(r._id) === String(queryChatId));
            if (matchedRoom) {
                setActiveRoom((prev: any) => (prev?._id === matchedRoom._id ? prev : matchedRoom));
                setMessageId((prev: any) => (prev === matchedRoom._id ? prev : matchedRoom._id));
                return;
            }
        }

        // 2. If URL specifies a participant userId
        if (queryUserId) {
            const matchedRoom = chatRooms.find((r: any) =>
                r.participants?.some((p: any) => String(p._id) === String(queryUserId))
            );
            if (matchedRoom) {
                setActiveRoom((prev: any) => (prev?._id === matchedRoom._id ? prev : matchedRoom));
                setMessageId((prev: any) => (prev === matchedRoom._id ? prev : matchedRoom._id));
                if (queryChatId !== matchedRoom._id) {
                    setSearchParams({ chatId: matchedRoom._id }, { replace: true });
                }
                return;
            }
        }

        // 3. If on desktop and nothing selected or selection not found, default to first room
        if (lg && (!messageId || !chatRooms.some((r: any) => r._id === messageId))) {
            const defaultRoom = chatRooms[0];
            if (defaultRoom) {
                setActiveRoom((prev: any) => (prev?._id === defaultRoom._id ? prev : defaultRoom));
                setMessageId((prev: any) => (prev === defaultRoom._id ? prev : defaultRoom._id));
                if (queryChatId !== defaultRoom._id) {
                    setSearchParams({ chatId: defaultRoom._id }, { replace: true });
                }
            }
        }
    }, [queryChatId, queryUserId, chatRoomIds, lg]);

    const selectRoom = (room: any) => {
        setActiveRoom(room);
        setMessageId(room._id);
        setSearchParams({ chatId: room._id });
    };

    const handleSelectUser = async (participantId: string) => {
        toast.promise(
            createChatRoom({
                participants: [participantId],
            }).unwrap(),
            {
                loading: 'Creating chat room...',
                success: (res) => {
                    const room = res?.data;
                    if (room) {
                        const otherParticipant = room?.participants?.find(
                            (participant: any) => participant._id !== user?._id
                        );
                        setTimeout(() => {
                            setActiveRoom({ ...room, participants: [otherParticipant] });
                            setMessageId(room._id);
                            setSearchParams({ chatId: room._id });
                            refetch();
                            setIsModalOpen(false);
                        }, 500);
                    }
                    return res?.message || 'Chat room created successfully';
                },
                error: (err) => {
                    return err?.data?.message || 'Failed to create chat room';
                },
            }
        );
    };

    if (isLoading) {
        return <Spinner />;
    }

    // Mobile view logic
    if (!lg) {
        if (messageId) {
            const selectedRoom =
                activeRoom || chatRooms.find((r: any) => r._id === messageId) || chatRooms[0];
            return (
                <div className="h-[calc(100vh-120px)] flex flex-col p-4">
                    <button
                        onClick={() => {
                            setMessageId(null);
                            setActiveRoom(null);
                            setSearchParams({});
                        }}
                        className="mb-4 text-emerald-700 font-semibold flex items-center gap-2 cursor-pointer hover:underline"
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
                <ChatSidebar
                    messageId={null}
                    onSelect={selectRoom}
                    chatRooms={chatRooms}
                    onNewChat={() => setIsModalOpen(true)}
                />
                <NewChatModal
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    user={user}
                    onSelectUser={handleSelectUser}
                    loading={isCreatingChatRoom}
                />
            </div>
        );
    }

    // Desktop view
    return (
        <div className="flex gap-5 h-[calc(100vh-200px)]">
            <div className="w-[340px] shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <ChatSidebar
                    messageId={messageId}
                    onSelect={selectRoom}
                    chatRooms={chatRooms}
                    onNewChat={() => setIsModalOpen(true)}
                />
            </div>
            <div className="grow min-w-0">
                <ChatConversation messageId={messageId} activeUser={activeRoom} />
            </div>

            <NewChatModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                user={user}
                onSelectUser={handleSelectUser}
                loading={isCreatingChatRoom}
            />
        </div>
    );
}
