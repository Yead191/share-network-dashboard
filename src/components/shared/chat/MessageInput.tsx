import { useState, useRef } from 'react';
import { Input, Button, Popover } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { Paperclip, Send, X } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface MessageInputProps {
    onSend?: (text: string, mediaFiles: File[]) => void;
    disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const textAreaRef = useRef<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const urls = files.map((file) => URL.createObjectURL(file));
        setMediaFiles((prev) => [...prev, ...files]);
        setPreviewUrls((prev) => [...prev, ...urls]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveMedia = (index: number) => {
        setMediaFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSend = () => {
        if (!message.trim() && mediaFiles.length === 0) return;

        if (onSend) {
            onSend(message, mediaFiles);
        }

        setMessage('');
        setMediaFiles([]);
        setPreviewUrls([]);

        // Ensure focus remains on the message textarea
        setTimeout(() => {
            textAreaRef.current?.focus();
        }, 0);
    };

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prev) => prev + emojiData.emoji);
        setTimeout(() => {
            textAreaRef.current?.focus();
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const canSend = (message.trim().length > 0 || mediaFiles.length > 0) && !disabled;

    return (
        <div className="flex flex-col gap-2">
            {/* Attachment Preview Bar */}
            {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-2.5 p-2.5 bg-gray-50/90 rounded-2xl border border-gray-100 shadow-2xs">
                    {previewUrls.map((url, index) => (
                        <div
                            key={index}
                            className="relative w-20 h-20 rounded-xl overflow-hidden border border-emerald-100 shadow-xs group shrink-0"
                        >
                            <img src={url} alt="preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemoveMedia(index)}
                                className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white rounded-full p-1 shadow-sm transition-colors cursor-pointer"
                                title="Remove"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Bar */}
            <div className="flex items-end gap-2 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-200/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Attach File Button */}
                <Button
                    type="text"
                    shape="circle"
                    icon={<Paperclip size={19} className="text-gray-400 hover:text-emerald-600 transition-colors" />}
                    onClick={() => fileInputRef.current?.click()}
                    className="hover:bg-gray-200/70 h-9 w-9 shrink-0 flex items-center justify-center"
                    title="Attach image"
                />

                {/* Text Input Area */}
                <div className="flex-1 min-w-0 flex items-center py-0.5">
                    <Input.TextArea
                        ref={textAreaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message (Press Enter to send, Shift+Enter for new line)..."
                        autoSize={{ minRows: 1, maxRows: 5 }}
                        bordered={false}
                        disabled={disabled}
                        className="p-1! text-[14px]! text-gray-800 placeholder:text-gray-400 resize-none outline-none focus:outline-none focus:ring-0 leading-relaxed"
                    />
                </div>

                {/* Emoji Picker Popover */}
                <Popover
                    content={<EmojiPicker onEmojiClick={onEmojiClick} />}
                    trigger="click"
                    placement="topLeft"
                    overlayInnerStyle={{ padding: 0, borderRadius: 16 }}
                >
                    <Button
                        type="text"
                        shape="circle"
                        icon={<SmileOutlined className="text-lg text-gray-400 hover:text-amber-500 transition-colors" />}
                        className="hover:bg-gray-200/70 h-9 w-9 shrink-0 flex items-center justify-center"
                        title="Add emoji"
                    />
                </Popover>

                {/* Send Button */}
                <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<Send size={16} className="ml-0.5" />}
                    onClick={handleSend}
                    disabled={!canSend}
                    className={`shrink-0 h-10 w-10 flex items-center justify-center transition-all duration-200 border-none shadow-sm cursor-pointer ${
                        canSend
                            ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-emerald-600/30'
                            : 'bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed'
                    }`}
                    title="Send message"
                />
            </div>
        </div>
    );
}
