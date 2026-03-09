import { Empty } from 'antd';
import { getImageUrl } from '../../../utils/getImageUrl';

interface ChatSidebarProps {
    messageId: string | null;
    onSelect: (room: any) => void;
    chatRooms: any[];
}

export function ChatSidebar({ messageId, onSelect, chatRooms }: ChatSidebarProps) {
    return (
        <div className="space-y-2 p-2">
            <div className="p-2 mb-4">
                <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            </div>
            {chatRooms.length === 0 ? (
                <div className="flex justify-center items-center ">
                    <Empty description="No Chatrooms Found" />
                </div>
            ) : (
                chatRooms?.map((room: any) => (
                    <button
                        key={room._id}
                        onClick={() => onSelect(room)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left group
            ${messageId === room._id ? 'bg-[#055E6E]/10 border border-[#055E6E]/20' : 'hover:bg-gray-50 border border-transparent'}
          `}
                    >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                            <img
                                src={
                                    room?.participants[0]?.profile
                                        ? getImageUrl(room?.participants[0]?.profile)
                                        : '/assets/images/provider/no_user.png'
                                }
                                alt={room?.participants[0]?.firstName + ' ' + room?.participants[0]?.lastName}
                                className="w-full h-full object-cover"
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
                ))
            )}
        </div>
    );
}
