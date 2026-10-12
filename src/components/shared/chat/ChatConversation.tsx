import { useRef, useEffect } from 'react';
import { Image as AntdImage, Avatar } from 'antd';
import MessageInput from './MessageInput';
import { useGetMessagesQuery, useSendMessageMutation } from '../../../redux/apiSlices/chatSlice';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import { getImageUrl } from '../../../utils/getImageUrl';
import { getSocket, joinChatRoom, leaveChatRoom, useIsUserOnline } from '../../../utils/socket';
import { toast } from 'sonner';

export function ChatConversation({ messageId, activeUser }: { messageId: any; activeUser: any }) {
    const { data: userData } = useProfileQuery({});
    const user = userData?.data;
    const containerRef = useRef<HTMLDivElement>(null);
    const { data, refetch } = useGetMessagesQuery(messageId);
    const [sendMessage] = useSendMessageMutation();

    const participant = activeUser?.participants?.[0];
    const participantName = `${participant?.firstName || ''} ${participant?.lastName || ''}`.trim() || 'Conversation';
    const isOnline = useIsUserOnline(participant?._id, user?._id);

    const socket = getSocket(user?._id);

    // Request notification permissions for desktop alerts
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().catch(() => {});
        }
    }, []);

    // Focus & blur tracking + real-time socket events
    useEffect(() => {
        if (!messageId) return;

        const handleFocus = () => {
            joinChatRoom(messageId);
        };

        const handleBlur = () => {
            leaveChatRoom(messageId);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                handleFocus();
            } else {
                handleBlur();
            }
        };

        // If window is currently focused, join chat room
        if (typeof document !== 'undefined' && document.hasFocus && document.hasFocus()) {
            handleFocus();
        }

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const handleNewMessage = (newMsg: any) => {
            refetch();

            // When unfocused, notify user via browser notification
            const isFromOther = newMsg?.sender?._id !== user?._id;
            if (isFromOther) {
                const isTabUnfocused = document.visibilityState !== 'visible' || !document.hasFocus();
                if (isTabUnfocused) {
                    const senderName =
                        `${newMsg?.sender?.firstName || ''} ${newMsg?.sender?.lastName || ''}`.trim() ||
                        'New Message';
                    const messageBody = newMsg?.text || (newMsg?.images?.length ? 'Sent an image attachment' : 'Sent a message');

                    if ('Notification' in window && Notification.permission === 'granted') {
                        try {
                            new Notification(`Message from ${senderName}`, {
                                body: messageBody,
                                icon: getImageUrl(newMsg?.sender?.profile || '') || '/logo.png',
                            });
                        } catch (e) {
                            console.warn('Browser notification error:', e);
                        }
                    }
                }
            }
        };

        socket.on(`getMessage::${messageId}`, handleNewMessage);

        return () => {
            handleBlur();
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            socket.off(`getMessage::${messageId}`, handleNewMessage);
        };
    }, [messageId, user?._id, socket, refetch]);

    const scrollToBottom = () => {
        const el = containerRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [data?.data?.messages]);

    const handleSendMessage = async (text: string, mediaFiles: File[]) => {
        try {
            const formData = new FormData();
            formData.append('text', text);
            formData.append('chatId', messageId);

            mediaFiles.forEach((file) => {
                formData.append('image', file);
            });

            await sendMessage(formData).unwrap();
            refetch();
        } catch (err: any) {
            console.error('Failed to send message:', err);
            toast.error(err?.data?.message || err?.message || 'Failed to send message. Please try again.');
        }
    };

    if (!messageId || !activeUser) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-200 text-gray-400 p-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Avatar size={36} className="bg-emerald-100 text-emerald-700">💬</Avatar>
                </div>
                <h4 className="font-semibold text-gray-700 text-sm mb-1">No conversation selected</h4>
                <p className="text-xs text-gray-400">Select a student or mentor from the list to start chatting</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl flex flex-col h-full shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar
                            size={44}
                            src={getImageUrl(participant?.profile || '')}
                            className={`border ${isOnline ? 'border-emerald-200' : 'border-gray-200'} shadow-2xs`}
                        />
                        <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white transition-colors duration-300 ${
                                isOnline ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-base leading-tight">
                            {participantName}
                        </h3>
                        {isOnline ? (
                            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Online
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                Offline
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[#F9FAFB] px-6 py-6" ref={containerRef}>
                <div className="flex flex-col-reverse justify-end min-h-full gap-4">
                    {data?.data?.messages?.map((msg: any) => {
                        const isMe = msg?.sender?._id === user?._id;
                        return (
                            <div
                                key={msg._id}
                                className={`flex items-end gap-3 max-w-[80%] ${
                                    isMe ? 'self-end flex-row-reverse' : 'self-start'
                                }`}
                            >
                                {!isMe && (
                                    <Avatar
                                        size={32}
                                        src={getImageUrl(participant?.profile)}
                                        className="mb-1 shrink-0 ring-1 ring-gray-100"
                                    />
                                )}
                                <div className="flex flex-col gap-1">
                                    <div
                                        className={`px-4 py-3 rounded-2xl text-[14px] shadow-xs ${
                                            isMe
                                                ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-br-none shadow-emerald-700/10'
                                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-gray-100'
                                        }`}
                                    >
                                        <div className="flex flex-row flex-wrap gap-2">
                                            {msg.images &&
                                                msg.images?.map((img: any) => (
                                                    <div key={img._id || img} className="mb-2 rounded-xl overflow-hidden shadow-xs">
                                                        <AntdImage
                                                            src={getImageUrl(img)}
                                                            width={200}
                                                            className="object-cover rounded-xl"
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                        {msg.text && <p className="m-0 leading-relaxed font-normal">{msg.text}</p>}
                                    </div>
                                    <div
                                        className={`flex items-center gap-1 text-[10px] text-gray-400 font-medium ${
                                            isMe ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <MessageInput onSend={handleSendMessage} />
            </div>
        </div>
    );
}

export default ChatConversation;
