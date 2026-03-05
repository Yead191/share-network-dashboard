import React from 'react';
import { Modal, Tag } from 'antd';
import { X } from 'lucide-react';

interface MentorDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    mentor: any;
}

interface DetailItem {
    label: string;
    value: React.ReactNode;
}

const MentorDetailsModal: React.FC<MentorDetailsModalProps> = ({ open, onCancel, mentor }) => {
    // console.log(mentor, 'selected mentor');
    if (!mentor) return null;

    const details: DetailItem[] = [
        { label: 'First Name', value: mentor.firstName },
        { label: 'Last Name', value: mentor.lastName },
        { label: 'Email', value: mentor.email },
        { label: 'Phone', value: mentor.mobileNumber || mentor.contactNumber },
        { label: 'vNumber', value: mentor.vNumber || 'N/A' },
        { label: 'Gender', value: mentor.gender },
        { label: 'Highest Education', value: mentor.highestEducation || 'N/A' },
        {
            label: 'Groups',
            value:
                mentor.userGroup && mentor.userGroup.length > 0 ? (
                    mentor.userGroup.map((group: any) => (
                        <Tag
                            key={group._id}
                            className="rounded-full px-4 py-0.5 bg-gray-50 border-gray-100 text-gray-500 font-medium"
                        >
                            {group.name}
                        </Tag>
                    ))
                ) : (
                    <span className="text-gray-400 italic">No Group</span>
                ),
        },
        { label: 'Laptop', value: mentor.havealaptop ? 'Yes' : 'No' },
        {
            label: 'Career Directions',
            value: mentor.careerDirections?.length > 0 ? mentor.careerDirections.join(', ') : 'None',
        },
        { label: 'Address', value: mentor.address || 'N/A' },
        { label: 'Professional Title', value: mentor.professionalTitle || 'N/A' },
        {
            label: 'Verified',
            value: (
                <Tag color={mentor.verified ? 'success' : 'error'} className="rounded-full">
                    {mentor.verified ? 'Verified' : 'Unverified'}
                </Tag>
            ),
        },
    ];

    return (
        <Modal
            title={<span className="text-xl font-semibold text-[#18212d]">Mentor Details</span>}
            open={open}
            onCancel={onCancel}
            footer={false}
            closeIcon={<X size={20} />}
            width={800}
            centered
        >
            <div className="border border-gray-100 rounded-lg overflow-hidden mt-6 mb-8">
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
                                <td className="py-4 px-6 text-gray-700 font-medium tracking-wide">
                                    {item.value || 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {mentor.assignedStudents?.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Assigned Students</h3>
                    <div className="border border-gray-100 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-6 text-left text-gray-500 font-medium">Name</th>
                                    <th className="py-3 px-6 text-left text-gray-500 font-medium">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mentor.assignedStudents.map((student: any) => (
                                    <tr key={student._id} className="border-t border-gray-100">
                                        <td className="py-3 px-6 text-gray-700 font-medium">
                                            {`${student.firstName} ${student.lastName}`}
                                        </td>
                                        <td className="py-3 px-6 text-gray-500 font-medium">{student.email}</td>
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

export default MentorDetailsModal;
