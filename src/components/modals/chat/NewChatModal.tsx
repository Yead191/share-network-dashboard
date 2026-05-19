import React from 'react';
import { Modal, List, Avatar, Tag, Typography } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import { getImageUrl } from '../../../utils/getImageUrl';

const { Text, Title } = Typography;

interface NewChatModalProps {
    open: boolean;
    onCancel: () => void;
    user: any;
    onSelectUser: (id: string) => void;
    loading?: boolean;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ open, onCancel, user, onSelectUser, loading }) => {
    // Determine candidates based on role
    const candidates = React.useMemo(() => {
        if (!user) return [];
        if (user.role === 'MENTOR') {
            return user.assignedStudents || [];
        } else if (user.role === 'STUDENT') {
            return user.mentorId ? [user.mentorId] : [];
        }
        return [];
    }, [user]);

    return (
        <Modal
            title={<Title level={4} className="m-0 text-gray-800">Start a New Conversation</Title>}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={520}
            className="rounded-2xl overflow-hidden"
            styles={{ body: { padding: 0 } }}
            centered
        >
            <div className="mb-4">
                <Text className="text-gray-500">Select a contact below to create a direct chat room.</Text>
            </div>
            <div className="max-h-[350px] overflow-y-auto pr-1">
                <List
                    dataSource={candidates}
                    loading={loading}
                    locale={{ emptyText: 'No contacts available to chat' }}
                    renderItem={(item: any) => {
                        // Helper to safely display user groups
                        const groupStr = item.userGroup
                            ? item.userGroup
                                .map((g: any) => (typeof g === 'object' ? g.name : g))
                                .join(', ')
                            : 'N/A';

                        // Helper to safely display track
                        const trackStr = item.userGroupTrack?.name || 'N/A';

                        return (
                            <List.Item
                                key={item._id}
                                className="cursor-pointer hover:bg-gray-50/80 !p-4 rounded-xl transition-all border border-transparent hover:border-gray-100 flex items-center justify-between gap-4 mb-2 "
                                onClick={() => onSelectUser(item._id)}
                            >
                                <div className="flex items-center gap-3 grow min-w-0">
                                    <Avatar
                                        src={item.profile ? getImageUrl(item.profile) : undefined}
                                        icon={!item.profile && <UserOutlined />}
                                        size={48}
                                        className="bg-gray-100 border border-gray-200 shrink-0"
                                    />
                                    <div className="grow min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-gray-800 text-sm truncate">
                                                {item.firstName} {item.lastName}
                                            </span>
                                            <Tag color={item.role === 'MENTOR' ? 'blue' : 'orange'} className="text-[10px] uppercase font-bold rounded-full px-2 py-0.2 border-none">
                                                {item.role}
                                            </Tag>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{item.email}</p>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {groupStr && groupStr !== 'N/A' && (
                                                <Tag className="m-0 text-[11px] bg-gray-50 text-gray-600 border-gray-200/60 rounded-full">
                                                    Group: {groupStr}
                                                </Tag>
                                            )}
                                            {trackStr && trackStr !== 'N/A' && (
                                                <Tag className="m-0 text-[11px] bg-blue-50/50 text-blue-600 border-blue-100/50 rounded-full">
                                                    Track: {trackStr}
                                                </Tag>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 text-gray-300 group-hover:text-primary transition-colors">
                                    <MessageOutlined className="text-lg text-gray-400" />
                                </div>
                            </List.Item>
                        );
                    }}
                />
            </div>
        </Modal>
    );
};

export default NewChatModal;
