import React from 'react';
import { Modal, Tag, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { imageUrl } from '../../../../redux/api/baseApi';

interface AssignmentDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    assignment: any;
}

const AssignmentDetailsModal: React.FC<AssignmentDetailsModalProps> = ({ open, onCancel, assignment }) => {
    if (!assignment) return null;

    return (
        <Modal
            title={<span className="text-xl font-bold text-gray-800">Assignment Details</span>}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            centered
        >
            <div className="mt-6 border border-gray-100 rounded-xl overflow-hidden bg-gray-50/30">
                <table className="w-full text-left border-collapse">
                    <tbody>
                        <tr className="border-b border-gray-100">
                            <td className="p-4 font-semibold text-gray-500 w-1/3 text-sm">Title</td>
                            <td className="p-4 text-gray-700 font-medium flex items-center justify-between group">
                                <span>{assignment.title}</span>
                                {assignment.attachment && (
                                    <a
                                        href={
                                            assignment.attachment.startsWith('http')
                                                ? assignment.attachment
                                                : `${imageUrl}${assignment.attachment.startsWith('/') ? assignment.attachment : `/${assignment.attachment}`}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[#3182CE] text-xs transition-opacity"
                                    >
                                        <DownloadOutlined />{' '}
                                        {assignment.attachment.startsWith('http') ? 'View URL' : 'Download'}
                                    </a>
                                )}
                            </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="p-4 font-semibold text-gray-500 text-sm">Description</td>
                            <td className="p-4 text-gray-700 tracking-tight text-sm">{assignment.description}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="p-4 font-semibold text-gray-500 text-sm">Group Track</td>
                            <td className="p-4 text-gray-700 font-medium">
                                <Tag
                                    color="error"
                                    className="bg-red-50 text-red-500 border-red-100 rounded px-2 font-medium"
                                >
                                    {assignment?.type?.name || 'N/A'}
                                </Tag>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="p-4 font-semibold text-gray-500 text-sm">Groups</td>
                            <td className="p-4">
                                <div className="flex flex-wrap gap-1">
                                    {assignment.targets?.map((t: { _id: string; name: string }) => (
                                        <Tag
                                            key={t._id}
                                            className="bg-gray-100 text-gray-600 border-none rounded-full px-4 font-medium uppercase text-[10px]"
                                        >
                                            {t.name}
                                        </Tag>
                                    ))}
                                </div>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="p-4 font-semibold text-gray-500 text-sm">Due Date</td>
                            <td className="p-4 text-gray-700 font-medium">
                                {new Date(assignment?.dueDate).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                            </td>
                        </tr>
                        <tr className="border-b-0">
                            <td className="p-4 font-semibold text-gray-500 text-sm">Status / Visibility</td>
                            <td className="p-4 flex gap-2">
                                <Tag
                                    className={`rounded-full px-4 font-medium text-[10px] ${assignment.published ? 'bg-blue-50 text-blue-500 border-none' : 'bg-gray-100 text-gray-500 border-none'}`}
                                >
                                    {assignment.published ? 'PUBLISHED' : 'UNPUBLISHED'}
                                </Tag>
                                <Tag
                                    className={`rounded-full px-4 font-medium text-[10px] ${
                                        assignment.status === 'COMPLETED'
                                            ? 'bg-green-50 text-green-500 border-none'
                                            : assignment.status === 'IN_PROGRESS'
                                              ? 'bg-blue-50 text-blue-500 border-none'
                                              : 'bg-yellow-50 text-yellow-500 border-none'
                                    }`}
                                >
                                    {assignment.status}
                                </Tag>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-6">
                <Button className="h-11 px-10 rounded-xl font-bold bg-white border-gray-200" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default AssignmentDetailsModal;
