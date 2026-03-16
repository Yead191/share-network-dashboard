import React from 'react';
import { Button, Modal, Popconfirm, Tag } from 'antd';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useRemoveAssignMutation } from '../../../redux/apiSlices/admin/adminStudentApi';

interface MentorDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    mentor: any;
    refetch: () => void;
}

interface DetailItem {
    label: string;
    value: React.ReactNode;
}

const MentorDetailsModal: React.FC<MentorDetailsModalProps> = ({ open, onCancel, mentor, refetch }) => {
    // console.log(mentor, 'selected mentor');
    const [removeAssign] = useRemoveAssignMutation();

    if (!mentor) return null;

    const details: DetailItem[] = [
        { label: 'First Name', value: mentor.firstName },
        { label: 'Last Name', value: mentor.lastName },
        { label: 'Email', value: mentor.email },
        { label: 'Phone', value: mentor.mobileNumber || mentor.contactNumber },
        { label: 'Gender', value: mentor.gender },
        { label: 'Highest Education', value: mentor.highestEducation || 'N/A' },
        {
            label: 'Groups',
            value:
                mentor.userGroup && mentor.userGroup.length > 0 ? (
                    mentor.userGroup.map((group: any) => (
                        <Tag
                            key={group._id || group}
                            className="rounded-full px-4 py-0.5 bg-[#f6ffed] border-none text-[#52c41a] font-medium"
                        >
                            {group?.name}
                            {group?.name === 'Skill Path' && mentor?.userGroupTrack?.name
                                ? ` (${mentor?.userGroupTrack?.name})`
                                : ''}
                        </Tag>
                    ))
                ) : (
                    <span className="text-gray-400 italic">No Group</span>
                ),
        },
        {
            label: 'jobTitle',
            value: mentor?.jobTitle || 'None',
        },
        { label: 'Address', value: mentor.address || 'N/A' },
        { label: 'Professional Title', value: mentor.professionalTitle || 'N/A' },
        {
            label: 'Status',
            value: (
                <Tag
                    className="rounded-full"
                    color={
                        mentor.status === 'ACTIVE'
                            ? 'success'
                            : mentor.status === 'PENDING'
                              ? 'warning'
                              : mentor.status === 'RESERVE'
                                ? 'processing'
                                : mentor.status === 'NON_ACTIVE'
                                  ? 'error'
                                  : 'default'
                    }
                >
                    {mentor.status}
                </Tag>
            ),
        },
    ];

    const handleRemoveAssign = (studentId: string, mentorId: string) => {
        toast.promise(
            removeAssign({
                studentId: studentId,
                mentorId: mentorId,
            }).unwrap(),
            {
                loading: 'Removing mentor...',
                success: (res: any) => {
                    refetch();
                    onCancel();
                    return res?.message || 'Mentor removed successfully';
                },
                error: (err: any) => err?.data?.message || 'Failed to remove mentor',
            },
        );
    };
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
                                        <td className="py-3 px-6 text-gray-500 font-medium">
                                            <div className="flex justify-between items-center">
                                                {student.email}
                                                <Popconfirm
                                                    title="Remove Student"
                                                    description="Are you sure you want to remove this student from the mentor?"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onConfirm={() => handleRemoveAssign(student._id, mentor._id)}
                                                >
                                                    <Button type="primary" danger>
                                                        <X size={16} />
                                                    </Button>
                                                </Popconfirm>
                                            </div>
                                        </td>
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
