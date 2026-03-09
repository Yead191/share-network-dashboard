import { useState } from 'react';
import { Table, Button, Input, Space, Tag, Avatar } from 'antd';
import { Search, Filter, Download, Eye, Edit2, Trash2, User, Plus } from 'lucide-react';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import ImportMentorsModal from '../../../components/modals/admin/ImportMentorsModal';
import MentorDetailsModal from '../../../components/modals/admin/MentorDetailsModal';
import EditMentorModal from '../../../components/modals/admin/EditMentorModal';
import ReviewMentorModal from '../../../components/modals/admin/ReviewMentorModal';
import MentorStudentsModal from '../../../components/modals/admin/MentorStudentsModal';
import { useDeleteAdminMentorMutation, useGetAdminMentorsQuery } from '../../../redux/apiSlices/admin/adminMentorsApi';
import AddMentorModal from '../../../components/modals/admin/AddMentorModal';
import FilterMentorModal from '../../../components/modals/admin/FilterMentorModal';
import { toast } from 'sonner';
import { Modal, message } from 'antd';
import {
    useGetStudentsQuery,
    useGetUserGroupsQuery,
    useGetUserTracksQuery,
} from '../../../redux/apiSlices/admin/adminStudentApi';
import Spinner from '../../../components/shared/Spinner';

const AdminMentors = () => {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
    const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<any>(null);
    const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // API CALLS
    const {
        data: mentorsApi,
        isLoading: isMentorLoading,
        refetch,
    } = useGetAdminMentorsQuery({ page, searchTerm, userGroup: selectedGroup });
    const { data: studentsApi } = useGetStudentsQuery({ page: 0, limit: 0 });
    const { data: userGroupsApi, isLoading: isUserGroupsLoading } = useGetUserGroupsQuery({});
    const { data: userTracksApi, isLoading: isUserTracksLoading } = useGetUserTracksQuery({});
    const [deleteMentor] = useDeleteAdminMentorMutation();
    const mentors = mentorsApi?.data?.mentors || [];
    const userGroups = userGroupsApi?.data;
    const userTracks = userTracksApi?.data;
    const pagination = mentorsApi?.data?.pagination;

    const columns = [
        {
            title: 'MENTOR',
            dataIndex: 'name',
            key: 'name',
            render: (_: string, record: any) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={record.profile}
                        icon={<User size={16} />}
                        className="bg-[#f6ffed] text-[#52c41a] flex items-center justify-center border-none"
                    />
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
            render: (userGroup: any[], record: any) => (
                <div className="flex gap-2 flex-wrap w-[200px]">
                    {userGroup?.map((group: any) => (
                        <Tag
                            key={group._id || group}
                            className="rounded-full px-4 py-0.5 bg-[#f6ffed] border-none text-[#52c41a] font-medium"
                        >
                            {group?.name}
                            {group?.name === 'Skill Path' && record?.userGroupTrack?.name
                                ? ` (${record.userGroupTrack.name})`
                                : ''}
                        </Tag>
                    ))}
                </div>
            ),
        },

        {
            title: 'Assigned Student',
            dataIndex: 'assignedStudents',
            key: 'assignedStudents',
            render: (assignedStudents: any[]) => (
                <div className="flex flex-wrap gap-2">
                    {assignedStudents?.map((student: any) => (
                        <Tag
                            key={student._id}
                            className="rounded-full px-4 py-0.5 bg-gray-50 border-gray-100 text-gray-500 font-medium"
                        >
                            {student?.firstName} {student?.lastName}
                        </Tag>
                    ))}
                </div>
            ),
        },
        {
            title: 'LOCATION',
            dataIndex: 'address',
            key: 'location',
            render: (address: string) => <span className="text-gray-500 font-medium">{address || 'N/A'}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const color = status === 'ACTIVE' || status === 'Active' ? '#f6ffed' : '#fff7e6';
                const textColor = status === 'ACTIVE' || status === 'Active' ? '#52c41a' : '#faad14';
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
                <Space size="small">
                    <Button
                        icon={<Eye size={14} />}
                        className="flex items-center gap-2 border-gray-200 text-gray-700 hover:text-black font-medium h-9 rounded-md"
                        onClick={() => {
                            setSelectedMentor(record);
                            setIsDetailsModalOpen(true);
                        }}
                    >
                        View
                    </Button>
                    <Button
                        icon={<Edit2 size={14} />}
                        className="flex items-center gap-2 border-gray-200 text-gray-700 hover:text-black font-medium h-9 rounded-md"
                        onClick={() => {
                            setSelectedMentor(record);
                            setIsEditModalOpen(true);
                        }}
                    >
                        Edit
                    </Button>
                    {/* <Button
                        icon={<Star size={14} />}
                        className="flex items-center gap-2 border-gray-200 text-gray-700 hover:text-black font-medium h-9 rounded-md"
                        onClick={() => {
                            setSelectedMentor(record);
                            setIsReviewModalOpen(true);
                        }}
                    >
                        Review
                    </Button> */}
                    <Button
                        icon={<Trash2 size={14} />}
                        danger
                        className="flex items-center gap-2 font-medium h-9 rounded-md border-red-200 text-red-500"
                        onClick={() => handleDelete(record._id)}
                    >
                        Remove
                    </Button>
                </Space>
            ),
        },
    ];

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to remove this mentor?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Remove',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    toast.promise(deleteMentor(id).unwrap(), {
                        loading: 'Removing mentor...',
                        success: (res: any) => {
                            if (res?.success) {
                                refetch();
                            }
                            return res?.message || 'Mentor removed successfully';
                        },
                        error: (err: any) => err?.data?.message || err?.message || 'Failed to remove mentor',
                    });
                } catch (error: any) {
                    message.error('Something went wrong');
                }
            },
        });
    };

    if (isMentorLoading || isUserGroupsLoading || isUserTracksLoading) {
        return <Spinner />;
    }
    return (
        <div className="">
            {/* Management Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-0 gap-4">
                <HeaderTitle title="Mentor Management" />
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        type="primary"
                        icon={<Plus size={16} />}
                        className="flex items-center gap-2 h-10 bg-[#52c41a] border-none hover:bg-[#73d13d] rounded-md font-semibold"
                        onClick={() => setIsAddMentorModalOpen(true)}
                    >
                        Create Mentor
                    </Button>
                    <Button
                        icon={<Filter size={16} />}
                        className={`flex items-center gap-2 h-10 border-gray-100 rounded-lg px-4 ${selectedGroup ? 'bg-green-50 text-green-600 border-green-200' : 'bg-white text-gray-600'}`}
                        onClick={() => setIsFilterModalOpen(true)}
                    >
                        Filter {selectedGroup && <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>}
                    </Button>
                    <Button
                        icon={<Download size={16} />}
                        className="flex items-center gap-2 h-10 border-gray-200 bg-white text-gray-600 rounded-lg px-4"
                        onClick={() => setIsImportModalOpen(true)}
                    >
                        Import Excel
                    </Button>
                    <div className="relative">
                        <Input
                            placeholder="Search Mentors...."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            prefix={<Search size={16} className="text-gray-400" />}
                            className="h-10 w-64 border-gray-100 bg-white rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <Table
                    columns={columns}
                    dataSource={mentors}
                    loading={isMentorLoading}
                    pagination={{
                        total: pagination?.totalItems,
                        current: pagination?.currentPage,
                        pageSize: 10,
                        onChange: (page) => {
                            setPage(page);
                        },
                    }}
                    className="mentor-management-table"
                    rowClassName="hover:bg-gray-50/50 transition-colors"
                />
            </div>

            {/* Modals */}
            <ImportMentorsModal
                open={isImportModalOpen}
                onCancel={() => setIsImportModalOpen(false)}
                refetch={refetch}
            />
            <FilterMentorModal
                open={isFilterModalOpen}
                onCancel={() => setIsFilterModalOpen(false)}
                onFilter={(groupId) => {
                    setSelectedGroup(groupId);
                    setPage(1); // Reset to first page on filter
                }}
                initialGroupId={selectedGroup}
            />
            <AddMentorModal
                open={isAddMentorModalOpen}
                onCancel={() => setIsAddMentorModalOpen(false)}
                refetch={refetch}
            />
            <MentorDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                mentor={selectedMentor}
            />
            <EditMentorModal
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                mentor={selectedMentor}
                students={studentsApi?.data?.data || []}
                refetch={refetch}
                userGroups={userGroups}
                userTracks={userTracks}
                isUserTracksLoading={isUserTracksLoading}
                isUserGroupsLoading={isUserGroupsLoading}
            />
            <ReviewMentorModal open={isReviewModalOpen} onCancel={() => setIsReviewModalOpen(false)} />
            <MentorStudentsModal
                open={isStudentsModalOpen}
                onCancel={() => setIsStudentsModalOpen(false)}
                mentor={selectedMentor}
            />
        </div>
    );
};

export default AdminMentors;
