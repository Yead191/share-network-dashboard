import { useState } from 'react';
import { Tabs, Spin } from 'antd';
import { AssignmentCard } from './components/AssignmentCard';
import { AssignmentDetailsModal } from './components/AssignmentDetailsModal';
import { useGetAssignmentsStudentQuery } from '../../../redux/apiSlices/students/assignmentsSlice';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import { Assignment, AssignmentStatus } from '../../../constants/student/assignments';

export default function StudentAssignment() {
    const [activeTab, setActiveTab] = useState<AssignmentStatus>('PENDING');
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get current logged-in user
    const { data: profileData } = useProfileQuery(undefined);
    const currentUserId = profileData?.data?._id;

    const { data, isLoading, isError, refetch } = useGetAssignmentsStudentQuery(
        { userGroup: profileData?.data?.userGroup?.[0]?._id },
        {
            skip: !profileData?.data?.userGroup?.[0]?._id,
        },
    );

    const handleCardClick = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setIsModalOpen(true);
    };

    const assignments: Assignment[] =
        data?.data?.map((item: any) => ({
            id: item._id,
            title: item.title,
            description: item.description,
            dueDate: item.dueDate,
            openDate: item.createdAt,
            status: item.status,
            subject: item.title.split(' ')[0],
            color: '#DCFCE7',
            attachment: item.attachment,
            teacher: item.teacher,
            userGroup: item.userGroup,
            submitAssignment:
                item.submitAssignment?.map((s: any) => ({
                    _id: s._id,
                    studentId: s.studentId,
                    fileAssignment: s.fileAssignment,
                    notes: s.notes,
                    createdAt: s.createdAt,
                    status: s.status,
                })) || [],
        })) || [];

    // Filter based on THIS user's submission status
    const getEffectiveStatus = (assignment: Assignment): AssignmentStatus => {
        if (!currentUserId) return 'PENDING';
        const mySubmission = assignment.submitAssignment?.find(
            (s) => s.studentId === currentUserId && s.status === 'COMPLETED',
        );
        return mySubmission ? 'COMPLETED' : 'PENDING';
    };

    const filteredAssignments = assignments.filter((assignment) => getEffectiveStatus(assignment) === activeTab);

    const tabItems = [
        { key: 'PENDING', label: 'Pending' },
        { key: 'COMPLETED', label: 'Completed' },
    ];

    return (
        <section className="space-y-6">
            <div className="bg-white px-2 rounded-2xl border border-gray-100 shadow-sm">
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key as AssignmentStatus)}
                    items={tabItems}
                    className="assignment-tabs [&>.ant-tabs-nav]:mb-0 [&>.ant-tabs-nav::before]:border-none"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <Spin size="large" />
                </div>
            ) : isError ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                    <p className="text-red-500 text-lg font-medium">Failed to load assignments.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredAssignments.length > 0 ? (
                        filteredAssignments.map((assignment) => (
                            <AssignmentCard
                                key={assignment.id}
                                assignment={assignment}
                                onClick={handleCardClick}
                                effectiveStatus={getEffectiveStatus(assignment)}
                            />
                        ))
                    ) : (
                        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                            <p className="text-[#94A3B8] text-lg font-medium">
                                No {activeTab.toLowerCase()} assignments found.
                            </p>
                        </div>
                    )}
                </div>
            )}

            <AssignmentDetailsModal
                isOpen={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                assignment={selectedAssignment}
                refetch={refetch}
                currentUserId={currentUserId}
            />
        </section>
    );
}
