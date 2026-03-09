import { useRef, useEffect, useMemo } from 'react';
import { Image as AntdImage, Avatar, Typography } from 'antd';
import MessageInput from './MessageInput';
import { io } from 'socket.io-client';
import { socketUrl } from '../../../redux/api/baseApi';
import { useGetMessagesQuery, useSendMessageMutation } from '../../../redux/apiSlices/chatSlice';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import { getImageUrl } from '../../../utils/getImageUrl';

const { Text } = Typography;

export function ChatConversation({ messageId, activeUser }: { messageId: any; activeUser: any }) {
    const { data: userData } = useProfileQuery({});
    const user = userData?.data;
    const containerRef = useRef<HTMLDivElement>(null);
    const { data, refetch } = useGetMessagesQuery(messageId);
    const [sendMessage] = useSendMessageMutation();
    const socket = useMemo(() => io(socketUrl), []);

    useEffect(() => {
        socket.on(`getMessage::${messageId}`, (data) => {
            console.log(data, 'socket msg');
            refetch();
        });
    }, [messageId, socket]);

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
        // Mock sending message

        const formData = new FormData();

        formData.append('text', text);
        formData.append('chatId', messageId);

        mediaFiles.forEach((file) => {
            formData.append('image', file);
        });
        const res = await sendMessage(formData).unwrap();
        console.log(res);
    };

    if (!messageId || !activeUser) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
                <p>Select a conversation to start chatting</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl flex flex-col h-full shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <Avatar
                        size={44}
                        src={getImageUrl(activeUser?.participants[0]?.profile)}
                        className="border border-gray-100"
                    />
                    <div>
                        <h3 className="font-bold text-gray-800 text-[16px] leading-tight">
                            {activeUser?.participants[0]?.firstName + ' ' + activeUser?.participants[0]?.lastName}
                        </h3>
                        <Text type="secondary" className="text-[12px]">
                            Online
                        </Text>
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
                                className={`flex items-end gap-3 max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                            >
                                {!isMe && (
                                    <Avatar
                                        size={32}
                                        src={getImageUrl(activeUser?.participants[0]?.profile)}
                                        className="mb-1 shrink-0"
                                    />
                                )}
                                <div className="flex flex-col gap-1">
                                    <div
                                        className={`px-4 py-3 rounded-2xl text-[14px] shadow-sm  ${
                                            isMe
                                                ? 'bg-[#055E6E] text-white rounded-br-none'
                                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 '
                                        }`}
                                    >
                                        <div className="flex flex-row flex-wrap">
                                            {msg.images &&
                                                msg.images?.map((img: any) => (
                                                    <div key={img._id} className="mb-2 rounded-lg overflow-hidden">
                                                        <AntdImage
                                                            src={getImageUrl(img)}
                                                            width={200}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                        {msg.text && <p className="m-0 leading-relaxed font-medium">{msg.text}</p>}
                                    </div>
                                    <div
                                        className={`flex items-center gap-1 text-[10px] text-gray-400 ${isMe ? 'justify-end' : 'justify-start'}`}
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
