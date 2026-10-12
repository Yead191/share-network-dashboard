import { Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getImageUrl } from '../../../utils/getImageUrl';
import { useOnlineUsers } from '../../../utils/socket';

interface ChatSidebarProps {
    messageId: string | null;
    onSelect: (room: any) => void;
    chatRooms: any[];
    onNewChat?: () => void;
}

export function ChatSidebar({ messageId, onSelect, chatRooms, onNewChat }: ChatSidebarProps) {
    const onlineUsers = useOnlineUsers();

    return (
        <div className="space-y-2 p-2">
            <div className="p-2 mb-4 flex justify-between items-center border-b border-gray-50 pb-3">
                <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                {onNewChat && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onNewChat}
                        className="bg-[#055E6E] hover:bg-[#055E6E]/90 border-none rounded-full flex items-center justify-center h-8 w-8 p-0"
                    />
                )}
            </div>
            {chatRooms.length === 0 ? (
                <div className="flex justify-center items-center ">
                    <Empty description="No Chatrooms Found" />
                </div>
            ) : (
                chatRooms?.map((room: any) => {
                    const participant = room?.participants?.[0];
                    const isOnline = participant?._id && onlineUsers.includes(String(participant._id));

                    return (
                        <button
                            key={room._id}
                            onClick={() => onSelect(room)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left group
            ${messageId === room._id ? 'bg-[#055E6E]/10 border border-[#055E6E]/20' : 'hover:bg-gray-50 border border-transparent'}
          `}
                        >
                            <div className="relative w-12 h-12 rounded-full shrink-0 bg-gray-100 border border-gray-200">
                                <img
                                    src={
                                        participant?.profile
                                            ? getImageUrl(participant.profile)
                                            : '/assets/images/provider/no_user.png'
                                    }
                                    alt={participant?.firstName + ' ' + participant?.lastName}
                                    className="w-full h-full object-cover rounded-full"
                                />
                                <span
                                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white transition-colors duration-300 ${
                                        isOnline ? 'bg-emerald-500' : 'bg-gray-300'
                                    }`}
                                />
                            </div>
                        <div className="grow min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <h4
                                    className={`font-semibold text-gray-800 truncate text-[15px] ${messageId === room._id ? 'text-[#055E6E]' : ''}`}
                                >
                                    {room?.participants[0]?.firstName + ' ' + room?.participants[0]?.lastName}
                                </h4>
                                <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                                    {room?.lastMessage?.createdAt &&
                                        new Date(room.lastMessage.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[13px] text-gray-500 truncate mr-2">
                                    {room?.lastMessage?.text || 'No messages yet'}
                                </p>
                                {room.unread > 0 && (
                                    <span className="bg-[#055E6E] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                                        {room.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                    );
                })
            )}
        </div>
    );
}
