import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Image as AntdImage, Avatar, Tooltip } from 'antd';
import MessageInput from './MessageInput';
import { useGetMessagesQuery, useSendMessageMutation } from '../../../redux/apiSlices/chatSlice';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import { getImageUrl } from '../../../utils/getImageUrl';
import { getSocket, joinChatRoom, leaveChatRoom, useIsUserOnline } from '../../../utils/socket';
import { toast } from 'sonner';
import { ChevronDown, CheckCheck, Clock, ShieldAlert, Sparkles } from 'lucide-react';

interface ILocalMessage {
    _id: string;
    text?: string;
    sender: any;
    images?: string[];
    createdAt: string;
    status?: 'sending' | 'sent' | 'failed';
}

export function ChatConversation({ messageId, activeUser }: { messageId: any; activeUser: any }) {
    const { data: userData } = useProfileQuery({});
    const user = userData?.data;

    const participant = activeUser?.participants?.[0];
    const participantName = `${participant?.firstName || ''} ${participant?.lastName || ''}`.trim() || 'Conversation';
    const isOnline = useIsUserOnline(participant?._id, user?._id);

    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data } = useGetMessagesQuery(messageId);
    const [sendMessage] = useSendMessageMutation();

    const [localMessages, setLocalMessages] = useState<ILocalMessage[]>([]);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [unreadWhileScrolled, setUnreadWhileScrolled] = useState(0);
    const isAtBottomRef = useRef(true);

    // Sync query messages into localMessages
    useEffect(() => {
        if (data?.data?.messages) {
            // Server messages are newest-first, we merge preserving pending messages
            const serverMsgs: ILocalMessage[] = (data.data.messages || []).map((m: any) => ({
                ...m,
                status: 'sent',
            }));

            setLocalMessages((prev) => {
                const pending = prev.filter((p) => p.status === 'sending');
                // Filter out any pending message that has now been saved on server
                const filteredPending = pending.filter(
                    (p) => !serverMsgs.some((s) => s.text === p.text && s.sender?._id === p.sender?._id)
                );
                return [...serverMsgs, ...filteredPending];
            });
        }
    }, [data?.data?.messages]);

    // Request desktop notification permission
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().catch(() => {});
        }
    }, []);

    // Scroll to bottom helper
    const scrollToBottom = useCallback((smooth = true) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
            setUnreadWhileScrolled(0);
        }
    }, []);

    // Initial scroll on messageId change or initial load
    useEffect(() => {
        if (localMessages.length > 0) {
            setTimeout(() => {
                scrollToBottom(false);
            }, 50);
        }
    }, [messageId]);

    // Focus & blur tracking + real-time socket events
    useEffect(() => {
        if (!messageId) return;

        const socket = getSocket(user?._id);

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

        if (typeof document !== 'undefined' && document.hasFocus && document.hasFocus()) {
            handleFocus();
        }

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const handleNewMessage = (newMsg: any) => {
            setLocalMessages((prev) => {
                // If message is already present by real _id, skip
                if (prev.some((m) => m._id === newMsg._id)) return prev;

                // If sent by me, check if there is a pending optimistic message to replace
                const isSentByMe = newMsg?.sender?._id === user?._id;
                if (isSentByMe) {
                    const tempIndex = prev.findIndex(
                        (m) =>
                            (m.status === 'sending' || m._id.startsWith('temp-')) &&
                            m.text === newMsg.text
                    );
                    if (tempIndex !== -1) {
                        const updated = [...prev];
                        updated[tempIndex] = { ...newMsg, status: 'sent' };
                        return updated;
                    }
                }

                return [newMsg, ...prev];
            });

            // If user is near bottom, scroll down immediately
            if (isAtBottomRef.current) {
                setTimeout(() => scrollToBottom(true), 60);
            } else {
                setUnreadWhileScrolled((prev) => prev + 1);
            }

            // Desktop notification when unfocused
            const isFromOther = newMsg?.sender?._id !== user?._id;
            if (isFromOther) {
                const isTabUnfocused = document.visibilityState !== 'visible' || !document.hasFocus();
                if (isTabUnfocused) {
                    const senderName =
                        `${newMsg?.sender?.firstName || ''} ${newMsg?.sender?.lastName || ''}`.trim() ||
                        'New Message';
                    const messageBody =
                        newMsg?.text || (newMsg?.images?.length ? 'Sent an image attachment' : 'Sent a message');

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
    }, [messageId, user?._id, scrollToBottom]);

    // Handle scroll position and toggle floating button
    const handleScroll = () => {
        const el = containerRef.current;
        if (!el) return;

        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        const isNearBottom = distanceFromBottom < 100;

        isAtBottomRef.current = isNearBottom;
        setShowScrollButton(!isNearBottom);

        if (isNearBottom) {
            setUnreadWhileScrolled(0);
        }
    };

    // Instant optimistic send
    const handleSendMessage = async (text: string, mediaFiles: File[]) => {
        const tempId = `temp-${Date.now()}`;
        const previewImageUrls = mediaFiles.map((file) => URL.createObjectURL(file));

        // 1. Optimistic Message object
        const optimisticMsg: ILocalMessage = {
            _id: tempId,
            text,
            sender: {
                _id: user?._id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                profile: user?.profile,
            },
            images: previewImageUrls,
            createdAt: new Date().toISOString(),
            status: 'sending',
        };

        // 2. Add immediately to local state
        setLocalMessages((prev) => [optimisticMsg, ...prev]);

        // 3. Immediately scroll to bottom smoothly
        setTimeout(() => scrollToBottom(true), 20);

        try {
            const formData = new FormData();
            formData.append('text', text);
            formData.append('chatId', messageId);

            mediaFiles.forEach((file) => {
                formData.append('image', file);
            });

            const res = await sendMessage(formData).unwrap();
            const serverMsg = res?.data;

            if (serverMsg) {
                setLocalMessages((prev) => {
                    const alreadyExists = prev.some((m) => m._id === serverMsg._id);
                    if (alreadyExists) {
                        return prev.filter((m) => m._id !== tempId);
                    }
                    return prev.map((m) => (m._id === tempId ? { ...serverMsg, status: 'sent' } : m));
                });
            }
            setTimeout(() => scrollToBottom(true), 30);
        } catch (err: any) {
            console.error('Failed to send message:', err);
            setLocalMessages((prev) =>
                prev.map((m) => (m._id === tempId ? { ...m, status: 'failed' } : m))
            );
            toast.error(err?.data?.message || err?.message || 'Failed to send message. Please retry.');
        }
    };

    // Sort messages chronologically: oldest first, newest at the bottom, deduplicating by _id
    const sortedMessages = useMemo(() => {
        const seenIds = new Set<string>();
        const unique: ILocalMessage[] = [];

        for (const msg of localMessages) {
            if (!seenIds.has(msg._id)) {
                seenIds.add(msg._id);
                unique.push(msg);
            }
        }

        return unique.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }, [localMessages]);

    // Format date divider helper
    const formatDividerDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (!messageId || !activeUser) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-200 text-gray-400 p-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 ring-8 ring-emerald-50/50">
                    <Sparkles size={24} className="text-emerald-600" />
                </div>
                <h4 className="font-bold text-gray-800 text-base mb-1">No conversation selected</h4>
                <p className="text-xs text-gray-400 max-w-xs text-center">
                    Select a conversation from the sidebar or click a user to begin exchanging real-time messages.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl flex flex-col h-full shadow-sm overflow-hidden relative">
            {/* Header */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-md z-10">
                <div className="flex items-center gap-3.5">
                    <div className="relative">
                        <Avatar
                            size={44}
                            src={getImageUrl(participant?.profile || '')}
                            className={`border ${isOnline ? 'border-emerald-200 ring-2 ring-emerald-100' : 'border-gray-200'} shadow-2xs`}
                        />
                        <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white transition-colors duration-300 ${
                                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                            }`}
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-base leading-tight tracking-tight">
                            {participantName}
                        </h3>
                        {isOnline ? (
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Online
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                Offline
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Scrollable Messages Container */}
            <div
                className="flex-1 overflow-y-auto bg-[#F8FAFC] px-4 sm:px-6 py-6 scroll-smooth relative"
                ref={containerRef}
                onScroll={handleScroll}
            >
                <div className="flex flex-col gap-3 min-h-full justify-end">
                    {sortedMessages.length === 0 ? (
                        <div className="my-auto py-12 text-center flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                                💬
                            </div>
                            <h4 className="text-sm font-bold text-gray-700 mb-1">Start the conversation</h4>
                            <p className="text-xs text-gray-400 max-w-xs">
                                Send a message to {participantName} to initiate your conversation.
                            </p>
                        </div>
                    ) : (
                        sortedMessages.map((msg, index) => {
                            const isMe = msg?.sender?._id === user?._id;
                            const prevMsg = sortedMessages[index - 1];

                            // Check if a date divider is needed
                            const currentDate = new Date(msg.createdAt).toDateString();
                            const prevDate = prevMsg ? new Date(prevMsg.createdAt).toDateString() : null;
                            const showDateDivider = currentDate !== prevDate;

                            return (
                                <div key={msg._id} className="flex flex-col">
                                    {/* Date Divider Badge */}
                                    {showDateDivider && (
                                        <div className="flex items-center justify-center my-4">
                                            <span className="px-3 py-1 bg-white/90 text-gray-500 rounded-full text-[11px] font-semibold border border-gray-200/60 shadow-2xs">
                                                {formatDividerDate(msg.createdAt)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Message Bubble Row */}
                                    <div
                                        className={`flex items-end gap-2.5 max-w-[85%] sm:max-w-[75%] ${
                                            isMe ? 'self-end flex-row-reverse' : 'self-start'
                                        }`}
                                    >
                                        {!isMe && (
                                            <Avatar
                                                size={32}
                                                src={getImageUrl(participant?.profile)}
                                                className="mb-1 shrink-0 ring-1 ring-gray-200 shadow-2xs"
                                            />
                                        )}

                                        <div className="flex flex-col gap-1 max-w-full">
                                            <div
                                                className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-xs transition-all ${
                                                    isMe
                                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-xs shadow-emerald-700/10'
                                                        : 'bg-white text-gray-900 rounded-bl-xs border border-gray-200/80 shadow-2xs'
                                                } ${msg.status === 'sending' ? 'opacity-80' : ''}`}
                                            >
                                                {/* Images */}
                                                {msg.images && msg.images.length > 0 && (
                                                    <div className="flex flex-row flex-wrap gap-2 mb-2">
                                                        {msg.images.map((img: any, imgIdx: number) => (
                                                            <div
                                                                key={imgIdx}
                                                                className="rounded-xl overflow-hidden border border-black/5 shadow-xs"
                                                            >
                                                                <AntdImage
                                                                    src={getImageUrl(img)}
                                                                    width={220}
                                                                    className="object-cover rounded-xl"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Text Content */}
                                                {msg.text && (
                                                    <p className="m-0 whitespace-pre-wrap break-words font-normal">
                                                        {msg.text}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Timestamp & Status Metadata */}
                                            <div
                                                className={`flex items-center gap-1.5 text-[10px] text-gray-400 font-medium px-1 ${
                                                    isMe ? 'justify-end' : 'justify-start'
                                                }`}
                                            >
                                                <span>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>

                                                {isMe && (
                                                    <>
                                                        {msg.status === 'sending' && (
                                                            <Clock size={11} className="text-gray-400 animate-spin" />
                                                        )}
                                                        {msg.status === 'failed' && (
                                                            <Tooltip title="Failed to send. Click to retry.">
                                                                <ShieldAlert size={12} className="text-rose-500 cursor-pointer" />
                                                            </Tooltip>
                                                        )}
                                                        {(!msg.status || msg.status === 'sent') && (
                                                            <CheckCheck size={13} className="text-emerald-500" />
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {/* Anchor for Auto Scroll */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Floating Scroll-to-Bottom Button */}
            {showScrollButton && (
                <button
                    type="button"
                    onClick={() => scrollToBottom(true)}
                    className="absolute right-6 bottom-20 z-20 flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-700/30 border border-emerald-500/30 transition-all duration-200 active:scale-95 cursor-pointer animate-fade-in group"
                    title="Scroll to latest messages"
                >
                    <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                    <span className="text-xs font-semibold">Latest</span>
                    {unreadWhileScrolled > 0 && (
                        <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center -mr-1">
                            {unreadWhileScrolled}
                        </span>
                    )}
                </button>
            )}

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-gray-100 z-10">
                <MessageInput onSend={handleSendMessage} />
            </div>
        </div>
    );
}

export default ChatConversation;
