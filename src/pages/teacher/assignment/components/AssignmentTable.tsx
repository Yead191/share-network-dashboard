import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, Switch } from 'antd';
import {
    FilePdfOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
    LinkOutlined,
} from '@ant-design/icons';
import { IPagination } from '../../../../types/teacher/home/class.type';
import { imageUrl } from '../../../../redux/api/baseApi';

interface AssignmentTableProps {
    data: any[];
    onView: (record: any) => void;
    onEdit: (record: any) => void;
    onDelete: (key: string) => void;
    isLoading: boolean;
    pagination: IPagination;
    setPage: (page: number) => void;
    handleChangeStatus: (key: string, status: string) => void;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({
    data,
    onView,
    onEdit,
    onDelete,
    isLoading,
    pagination,
    setPage,
    handleChangeStatus,
}) => {
    const columns = [
        {
            title: 'TITLE',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                        <FilePdfOutlined className="text-gray-400 text-lg" />
                    </div>
                    <div>
                        <div className="font-bold text-gray-800">{text}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[150px]">{record.description}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'ATTACHMENT',
            dataIndex: 'attachment',
            key: 'attachment',
            render: (text: any) => {
                if (!text || typeof text !== 'string') {
                    return <span className="font-medium text-gray-400 italic">No Attachment</span>;
                }
                const isUrl = text.startsWith('http');
                return (
                    <div className="flex items-center gap-2">
                        {isUrl ? (
                            <Button
                                icon={<LinkOutlined />}
                                size="small"
                                className="flex items-center gap-1 text-blue-500 border-blue-100 bg-blue-50 hover:bg-blue-100"
                                onClick={() => window.open(text, '_blank')}
                            >
                                Open URL
                            </Button>
                        ) : (
                            <Button
                                icon={<DownloadOutlined />}
                                size="small"
                                className="flex items-center gap-1 text-green-500 border-green-100 bg-green-50 hover:bg-green-100"
                                onClick={() => {
                                    const fileUrl = text.startsWith('http')
                                        ? text
                                        : `${imageUrl}${text.startsWith('/') ? text : `/${text}`}`;
                                    window.open(fileUrl, '_blank');
                                }}
                            >
                                Download
                            </Button>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'TARGET',
            dataIndex: 'targets',
            key: 'targets',
            render: (targets: { name: string; _id: string }[]) => (
                <div className="flex flex-col gap-1">
                    {targets?.map((t) => (
                        <Tag
                            key={t._id}
                            className={`${t.name === 'Skill Path' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'} rounded-full px-3 py-0.5 text-[10px] w-fit font-medium`}
                        >
                            {t.name}
                        </Tag>
                    ))}
                </div>
            ),
        },
        {
            title: 'DUE DATE',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date: string) => (
                <span className="font-medium text-gray-700">
                    {new Date(date).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })}
                </span>
            ),
        },
        {
            title: 'VISIBILITY / STATUS',
            dataIndex: 'published',
            key: 'published',
            render: (published: boolean, record: any) => (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={published}
                            onChange={(checked) => handleChangeStatus(record.key, checked ? 'Active' : 'Inactive')}
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                            className={published ? 'bg-green-500' : 'bg-gray-300'}
                        />
                    </div>
                    <Tag
                        className={`w-fit rounded-lg text-[10px] px-2 py-0.5 font-bold ${
                            record.status === 'COMPLETED'
                                ? 'bg-green-50 text-green-500 border-green-100'
                                : record.status === 'IN_PROGRESS'
                                  ? 'bg-blue-50 text-blue-500 border-blue-100'
                                  : 'bg-yellow-50 text-yellow-500 border-yellow-100'
                        }`}
                    >
                        {record.status}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'ACTION',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        className="flex items-center gap-2 font-medium border-gray-200"
                        onClick={() => onView(record)}
                    >
                        View
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        className="flex items-center gap-2 font-medium border-gray-200"
                        onClick={() => onEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Assignment"
                        description="Are you sure you want to delete this assignment?"
                        onConfirm={() => onDelete(record.key)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            className="flex items-center gap-2 font-medium border-red-100 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            loading={isLoading}
            columns={columns}
            dataSource={data}
            pagination={{
                pageSize: 10,
                current: pagination?.page,
                total: pagination?.total,
                onChange: (page) => setPage(page),
            }}
            className="custom-dashboard-table"
        />
    );
};

export default AssignmentTable;
