import React from 'react';
import { Modal, Button, Tag } from 'antd';
import { X } from 'lucide-react';

interface TeacherDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    teacher: any;
}

const TeacherDetailsModal: React.FC<TeacherDetailsModalProps> = ({ open, onCancel, teacher }) => {
    if (!teacher) return null;

    const details = [
        { label: 'First Name', value: teacher.firstName },
        { label: 'Last Name', value: teacher.lastName },
        { label: 'Email', value: teacher.email },
        { label: 'Phone', value: teacher.mobileNumber || teacher.phone },
        { label: 'Gender', value: teacher.gender || 'Not specified' },
        {
            label: 'Groups',
            value:
                teacher.userGroup && teacher.userGroup.length > 0 ? (
                    teacher.userGroup.map((group: any) => (
                        <Tag
                            key={group._id || group}
                            className="rounded-full px-4 py-0.5 bg-[#f6ffed] border-none text-[#52c41a] font-medium"
                        >
                            {group?.name}
                            {group?.name === 'Skill Path' && teacher?.userGroupTrack?.name
                                ? ` (${teacher.userGroupTrack.name})`
                                : ''}
                        </Tag>
                    ))
                ) : (
                    <span className="text-gray-400 italic">No Group</span>
                ),
        },
        // { label: 'Track', value: teacher?.userGroupTrack?.name || 'N/A' },
        { label: 'About', value: teacher.about || 'No bio provided' },
        { label: 'Verified', value: teacher.verified ? 'Yes' : 'No' },
        { label: 'Subscribed', value: teacher.isSubscribed ? 'Yes' : 'No' },
    ];

    return (
        <Modal
            title={<span className="text-xl font-semibold">Teacher Details</span>}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel} className="px-8 h-10 border-gray-300 rounded-md">
                    Cancel
                </Button>,
            ]}
            closeIcon={<X size={20} />}
            width={700}
        >
            <div className="border border-gray-100 rounded-lg overflow-hidden mt-4">
                <table className="w-full text-sm">
                    <tbody>
                        {details.map((item, index) => (
                            <tr
                                key={index}
                                className={`${index !== details.length - 1 ? 'border-b border-gray-100' : ''}`}
                            >
                                <td className="py-4 px-6 bg-gray-50/50 text-gray-500 w-1/3 font-medium">
                                    {item.label}
                                </td>
                                <td className="py-4 px-6 text-gray-700">{item.value || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {teacher.assignedStudents?.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Assigned Students</h3>
                    <div className="border border-gray-100 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-6 text-left text-gray-500 font-medium">Name</th>
                                    <th className="py-3 px-6 text-left text-gray-500 font-medium">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teacher.assignedStudents.map((student: any) => (
                                    <tr key={student._id} className="border-t border-gray-100">
                                        <td className="py-3 px-6 text-gray-700">
                                            {student.firstName} {student.lastName}
                                        </td>
                                        <td className="py-3 px-6 text-gray-500">{student.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default TeacherDetailsModal;
