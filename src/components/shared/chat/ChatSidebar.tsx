import { useState, useMemo } from 'react';
import { Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Search, X } from 'lucide-react';
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
    const [search, setSearch] = useState('');

    const filteredRooms = useMemo(() => {
        if (!search.trim()) return chatRooms;
        const q = search.toLowerCase().trim();
        return chatRooms.filter((room: any) => {
            const p = room?.participants?.[0];
            const name = `${p?.firstName || ''} ${p?.lastName || ''}`.toLowerCase();
            const email = (p?.email || '').toLowerCase();
            const lastMsg = (room?.lastMessage?.text || '').toLowerCase();
            return name.includes(q) || email.includes(q) || lastMsg.includes(q);
        });
    }, [chatRooms, search]);

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Messages</h2>
                        {chatRooms.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                {chatRooms.length}
                            </span>
                        )}
                    </div>
                    {onNewChat && (
                        <button
                            type="button"
                            onClick={onNewChat}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
                            title="Start New Conversation"
                        >
                            <PlusOutlined className="text-xs" />
                            <span>New</span>
                        </button>
                    )}
                </div>

                {/* Search Bar */}
                <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none transition-colors" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 text-slate-800 placeholder:text-slate-400 transition-all duration-200 outline-none shadow-2xs font-normal"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/80 transition-colors cursor-pointer flex items-center justify-center"
                            title="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredRooms.length === 0 ? (
                    <div className="py-12 px-4 text-center">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span className="text-xs text-gray-400 font-medium">
                                    {search ? 'No matching conversations' : 'No conversations yet'}
                                </span>
                            }
                        />
                    </div>
                ) : (
                    filteredRooms.map((room: any) => {
                        const participant = room?.participants?.[0];
                        const isSelected = messageId === room._id;
                        const isOnline = participant?._id && onlineUsers.includes(String(participant._id));
                        const participantName =
                            `${participant?.firstName || ''} ${participant?.lastName || ''}`.trim() || 'User';

                        return (
                            <button
                                key={room._id}
                                onClick={() => onSelect(room)}
                                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-150 text-left cursor-pointer group border ${
                                    isSelected
                                        ? 'bg-emerald-50/80 border-emerald-200 shadow-2xs'
                                        : 'hover:bg-gray-50 border-transparent'
                                }`}
                            >
                                {/* Avatar with online indicator */}
                                <div className="relative w-11 h-11 rounded-2xl shrink-0 bg-gray-100 border border-gray-200/60 overflow-hidden shadow-2xs">
                                    <img
                                        src={
                                            participant?.profile
                                                ? getImageUrl(participant.profile)
                                                : '/assets/images/provider/no_user.png'
                                        }
                                        alt={participantName}
                                        className="w-full h-full object-cover"
                                    />
                                    <span
                                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white transition-colors duration-300 ${
                                            isOnline ? 'bg-emerald-500' : 'bg-gray-300'
                                        }`}
                                    />
                                </div>

                                {/* Text information */}
                                <div className="grow min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4
                                            className={`font-bold truncate text-[14px] leading-tight ${
                                                isSelected ? 'text-emerald-900' : 'text-gray-900 group-hover:text-emerald-700'
                                            }`}
                                        >
                                            {participantName}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-1">
                                            {room?.lastMessage?.createdAt &&
                                                new Date(room.lastMessage.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <p className="text-[12px] text-gray-500 truncate mr-2 leading-relaxed">
                                            {room?.lastMessage?.text || (room?.lastMessage?.images?.length ? '📷 Image attachment' : 'No messages yet')}
                                        </p>
                                        {room.unread > 0 && (
                                            <span className="bg-emerald-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full shrink-0 shadow-2xs">
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
        </div>
    );
}

export default ChatSidebar;
