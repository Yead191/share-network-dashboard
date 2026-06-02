'use client';

import React from 'react';
import { Modal, Button, Space, Avatar, Typography } from 'antd';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface DeleteConfirmationModalProps {
    open: boolean;
    recordName: string;
    recordEmail: string;
    recordAvatar?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    open,
    recordName,
    recordEmail,
    recordAvatar,
    onConfirm,
    onCancel,
    loading = false,
}) => {
    return (
        <Modal
            title={null}
            open={open}
            onCancel={onCancel}
            footer={null}
            centered
            width={420}
            style={{
                borderRadius: 16,
            }}
            styles={{
                content: {
                    borderRadius: 16,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                },
            }}
        >
            <div style={{ textAlign: 'center', paddingTop: 12 }}>
                {/* Icon */}
                <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                }}>
                    <ExclamationCircleOutlined style={{ fontSize: 32, color: '#dc2626' }} />
                </div>

                {/* Title */}
                <Title level={4} style={{ margin: '0 0 12px 0', color: '#111827', fontSize: 18, fontWeight: 700 }}>
                    Delete Profile
                </Title>

                {/* Message */}
                <Text type="secondary" style={{ fontSize: 14, lineHeight: 1.6, display: 'block', marginBottom: 24 }}>
                    Are you sure you want to delete <span style={{ fontWeight: 600, color: '#374151' }}>{recordName}</span>&apos;s profile? This action cannot be undone.
                </Text>

                {/* Candidate Info Card */}
                <div style={{
                    background: '#f9fafb',
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 20,
                    border: '1px solid #e5e7eb',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar
                            src={recordAvatar}
                            icon={<UserOutlined />}
                            size={40}
                        />
                        <div style={{ textAlign: 'left' }}>
                            <Text strong style={{ display: 'block', fontSize: 13 }}>{recordName}</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>{recordEmail}</Text>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <Space style={{ width: '100%', justifyContent: 'center', gap: 12 }}>
                    <Button
                        onClick={onCancel}
                        disabled={loading}
                        size="large"
                        style={{
                            borderRadius: 8,
                            height: 40,
                            minWidth: 120,
                            fontWeight: 500,
                            border: '1px solid #e5e7eb',
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        danger
                        onClick={onConfirm}
                        loading={loading}
                        size="large"
                        style={{
                            borderRadius: 8,
                            height: 40,
                            minWidth: 120,
                            fontWeight: 500,
                            background: '#dc2626',
                            borderColor: '#dc2626',
                            color: "white"
                        }}
                    >
                        Delete
                    </Button>
                </Space>
            </div>
        </Modal>
    );
};
