import { useState } from 'react';
import { Table, Button, Input, Tag, Avatar, Modal } from 'antd';
import { Search, Eye, Edit2, Trash2, Link, GraduationCap } from 'lucide-react';
import ImportExcelModal from '../../../../components/modals/admin/ImportExcelModal';
import StudentDetailsModal from '../../../../components/modals/admin/StudentDetailsModal';
import EditStudentModal from '../../../../components/modals/admin/EditStudentModal';
import AssignMentorModal from '../../../../components/modals/admin/AssignMentorModal';
import ReviewModal from '../../../../components/modals/admin/ReviewModal';
import HeaderTitle from '../../../../components/shared/HeaderTitle';
import {
    useDeleteStudentMutation,
    useGetAllStudentsQuery,
    useGetUserGroupsQuery,
    useGetUserTracksQuery,
} from '../../../../redux/apiSlices/admin/adminStudentApi';
import { useGetAdminMentorsQuery } from '../../../../redux/apiSlices/admin/adminMentorsApi';
import { imageUrl } from '../../../../redux/api/baseApi';
import { toast } from 'sonner';
import { GoGoal } from 'react-icons/go';
import CreateGoalModal from '../../../../components/modals/admin/CreateGoalModal';

const Student = () => {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    // API CALLS
    const { data: studentsApi, refetch } = useGetAllStudentsQuery({ page, searchTerm });
    const { data: mentorsApi, isLoading: isMentorsLoading } = useGetAdminMentorsQuery({ page, searchTerm });
    const { data: userGroupsApi, isLoading: isUserGroupsLoading } = useGetUserGroupsQuery({});
    const { data: userTracksApi, isLoading: isUserTracksLoading } = useGetUserTracksQuery({});
    const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
    const allStudents = studentsApi?.data?.data;
    const allMentors = mentorsApi?.data?.mentors || [];
    const userGroups = userGroupsApi?.data;
    const userTracks = userTracksApi?.data;
    const pagination = studentsApi?.data?.pagination;

    const handleDeleteStudent = async () => {
        if (!selectedStudent?._id) return;

        toast.promise(deleteStudent(selectedStudent._id).unwrap(), {
            loading: 'Deleting student...',
            success: (res) => {
                setIsDeleteModalOpen(false);
                setSelectedStudent(null);
                refetch();
                return res?.message || 'Student deleted successfully';
            },
            error: (err: any) => err?.data?.message || 'Failed to delete student',
        });
    };

    const columns = [
        // ... (columns definitions)
        {
            title: 'STUDENT',
            dataIndex: 'firstName',
            key: 'name',
            render: (_: string, record: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f6ffed] flex items-center justify-center text-[#52c41a] overflow-hidden">
                        {record.profile ? (
                            <Avatar src={imageUrl + record.profile} size={40} />
                        ) : (
                            <GraduationCap size={20} />
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800">
                            {record.firstName} {record.lastName}
                        </div>
                        <div className="text-xs text-gray-400">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'GROUP/TRACK',
            dataIndex: 'userGroup',
            key: 'userGroup',
            render: (userGroup: string[]) => (
                <div className="flex gap-2 flex-wrap w-[200px]">
                    {userGroup?.map((group: any) => (
                        <Tag
                            key={group._id || group}
                            className="rounded-full px-4 py-0.5 bg-[#f6ffed] border-none text-[#52c41a] font-medium"
                        >
                            {group.name || group}
                        </Tag>
                    ))}
                </div>
            ),
        },
        {
            title: 'CURRENT MENTOR',
            dataIndex: 'mentorId',
            key: 'mentorId',
            render: (mentor: any) => {
                if (!mentor) {
                    return (
                        <Tag className="rounded-full px-4 py-0.5 bg-gray-50 border-gray-100 text-gray-400 font-medium">
                            No mentor assignment
                        </Tag>
                    );
                }
                return (
                    <div className="flex items-center gap-2">
                        <Avatar src={imageUrl + mentor.profile || mentor.profile} size="small" />
                        <span className="text-gray-600 font-medium">
                            {mentor.firstName} {mentor.lastName}
                        </span>
                    </div>
                );
            },
        },
        {
            title: 'STATUS',
            dataIndex: 'verified',
            key: 'status',
            render: (verified: boolean) => {
                const status = verified ? 'Verified' : 'Unverified';
                const color = verified ? '#f6ffed' : '#fff7e6';
                const textColor = verified ? '#52c41a' : '#faad14';
                return (
                    <Tag
                        className="rounded-full px-4 py-0.5 border-none font-medium"
                        style={{ backgroundColor: color, color: textColor }}
                    >
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: 'ACTION',
            key: 'action',
            render: (_: any, record: any) => (
                <div className="flex flex-wrap gap-2">
                    <Button
                        icon={<Eye size={14} />}
                        className="flex items-center gap-2 border-gray-200 text-gray-500 rounded-md h-8"
                        onClick={() => {
                            setSelectedStudent(record);
                            setIsDetailsModalOpen(true);
                        }}
                    >
                        View
                    </Button>
                    <Button
                        icon={<Edit2 size={14} />}
                        className="flex items-center gap-2 border-gray-200 text-gray-500 rounded-md h-8"
                        onClick={() => {
                            setSelectedStudent(record);
                            setIsEditModalOpen(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<Link size={14} />}
                        className="flex items-center gap-2 border-gray-200 text-gray-500 rounded-md h-8"
                        onClick={() => {
                            setSelectedStudent(record);
                            setIsAssignModalOpen(true);
                        }}
                    >
                        Assign
                    </Button>
                    <Button
                        icon={<GoGoal size={14} />}
                        onClick={() => {
                            setSelectedStudent(record);
                            setIsGoalModalOpen(true);
                        }}
                        className="flex items-center gap-2 border-gray-200 text-gray-500 rounded-md h-8"
                    >
                        Goals
                    </Button>
                    <Button
                        onClick={() => {
                            setSelectedStudent(record);
                            setIsDeleteModalOpen(true);
                        }}
                        icon={<Trash2 size={14} />}
                        danger
                        className="flex items-center gap-2 rounded-md h-8 border-[#ff4d4f]"
                    ></Button>
                </div>
            ),
        },
    ];

    return (
        <div className="py-6">
            <div className="flex justify-between items-center mb-8">
                <HeaderTitle title="Student Management" />
                <Input
                    placeholder="Search student"
                    prefix={<Search size={16} className="text-gray-400" />}
                    className="h-10 w-64 border-gray-100 bg-white rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
                <Table
                    columns={columns}
                    dataSource={allStudents}
                    loading={!allStudents && !studentsApi}
                    pagination={
                        pagination && {
                            current: page,
                            total: pagination.total,
                            pageSize: pagination.limit,
                            onChange: (p) => setPage(p),
                            showSizeChanger: false,
                        }
                    }
                    className="admin-students-table"
                    rowClassName="border-b last:border-0 border-gray-50"
                    rowKey="_id"
                />
            </div>

            {/* Modals */}
            <ImportExcelModal open={isImportModalOpen} onCancel={() => setIsImportModalOpen(false)} />
            <StudentDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                student={selectedStudent}
            />
            <EditStudentModal
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                student={selectedStudent}
                refetch={refetch}
            />
            <AssignMentorModal
                open={isAssignModalOpen}
                onCancel={() => setIsAssignModalOpen(false)}
                student={selectedStudent}
                allMentors={allMentors}
                isMentorsLoading={isMentorsLoading}
                refetch={refetch}
                userGroups={userGroups}
                userTracks={userTracks}
                isUserGroupsLoading={isUserGroupsLoading}
                isUserTracksLoading={isUserTracksLoading}
            />

            <CreateGoalModal
                open={isGoalModalOpen}
                onCancel={() => setIsGoalModalOpen(false)}
                studentId={selectedStudent?._id}
                refetch={refetch}
            />

            <ReviewModal
                open={isReviewModalOpen}
                onCancel={() => setIsReviewModalOpen(false)}
                student={selectedStudent}
            />

            <Modal
                title="Confirm Student Deletion"
                open={isDeleteModalOpen}
                onOk={handleDeleteStudent}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true, loading: isDeleting }}
                centered
            >
                <div className="py-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete{' '}
                        <b>
                            {selectedStudent?.firstName} {selectedStudent?.lastName}
                        </b>
                        ? This action will permanently remove the student account and cannot be undone.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default Student;
