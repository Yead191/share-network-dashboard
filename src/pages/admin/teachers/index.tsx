import { useState } from 'react';
import { Table, Button, Input, Space, Tag, Avatar } from 'antd';
import { Search, Filter, Download as DownloadIcon, Plus, Eye, Edit2, Trash2, User } from 'lucide-react';
import ImportExcelModal from '../../../components/modals/admin/ImportExcelModal';
import {
    useDeleteTeacherMutation,
    useGetAllStudentsQuery,
    useGetTeachersQuery,
} from '../../../redux/apiSlices/admin/adminTeachersApi';
import AddTeacherModal from '../../../components/modals/admin/AddTeacherModal';
import TeacherDetailsModal from '../../../components/modals/admin/TeacherDetailsModal';
import EditTeacherModal from '../../../components/modals/admin/EditTeacherModal';
import { Modal, message } from 'antd';
import { toast } from 'sonner';
import FilterMentorModal from '../../../components/modals/admin/FilterMentorModal';

const AdminTeachers = () => {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
    // API CALLS
    const { data: teachersApi, refetch } = useGetTeachersQuery({
        page: page,
        searchTerm: searchTerm,
        userGroup: selectedGroup,
    });
    const { data: studentsApi } = useGetAllStudentsQuery({});
    const [deleteTeacher] = useDeleteTeacherMutation();
    const teachers = teachersApi?.data || [];
    const students = studentsApi?.data?.data || [];

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Delete Teacher',
            content: 'Are you sure you want to delete this teacher?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    toast.promise(deleteTeacher({ id }).unwrap(), {
                        loading: 'Deleting teacher...',
                        success: (res: any) => {
                            if (res?.success) {
                                refetch();
                            }
                            return res?.message || 'Teacher deleted successfully';
                        },
                        error: (err: any) => err?.message || 'Failed to delete teacher',
                    });
                } catch (error: any) {
                    message.error(error?.data?.message || 'Something went wrong');
                }
            },
        });
    };

    // TABLE COLUMN
    const columns = [
        {
            title: 'TEACHER',
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
            title: 'GROUPS',
            dataIndex: 'userGroup',
            key: 'groups',
            render: (userGroup: any[]) => (
                <div className="flex flex-wrap gap-2">
                    {userGroup && userGroup.length > 0 ? (
                        userGroup.map((group: any) => (
                            <Tag
                                key={group._id}
                                className="rounded-full px-4 py-0.5 bg-gray-50 border-gray-100 text-gray-500 font-medium"
                            >
                                {group.name}
                            </Tag>
                        ))
                    ) : (
                        <span className="text-gray-400 italic">No Group</span>
                    )}
                </div>
            ),
        },
        {
            title: 'TRACK',
            dataIndex: 'userGroupTrack',
            key: 'track',
            render: (track: string) => <span className="text-gray-500">{track || 'N/A'}</span>,
        },
        {
            title: 'LOCATION',
            dataIndex: 'address',
            key: 'address',
            render: (_: any, record: any) => <span className="text-gray-500">{record.address || 'N/A'}</span>,
        },
        {
            title: 'STATUS',
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
                <Space size="middle">
                    <Button
                        icon={<Eye size={14} />}
                        className="flex items-center gap-2 border-gray-200 text-gray-700 hover:text-black font-medium"
                        onClick={() => {
                            setSelectedTeacher(record);
                            setIsDetailsModalOpen(true);
                        }}
                    >
                        View
                    </Button>
                    <Button
                        icon={<Edit2 size={14} />}
                        className="flex items-center gap-2 border-gray-200 text-gray-700 hover:text-black font-medium"
                        onClick={() => {
                            setSelectedTeacher(record);
                            setIsEditModalOpen(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<Trash2 size={14} />}
                        danger
                        className="flex items-center gap-2 font-medium"
                        onClick={() => handleDelete(record._id)}
                    >
                        Remove
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Teachers Management</h1>
                <div className="flex items-center gap-4">
                    <Button
                        icon={<Filter size={16} />}
                        onClick={() => setIsFilterModalOpen(true)}
                        className="flex items-center gap-2 h-10 border-gray-100 bg-white text-gray-600"
                    >
                        Filter
                    </Button>
                    <Button
                        icon={<DownloadIcon size={16} />}
                        className="flex items-center gap-2 h-10 border-gray-100 bg-white text-gray-600"
                        onClick={() => setIsImportModalOpen(true)}
                    >
                        Import Excel
                    </Button>
                    <div className="relative">
                        <Input
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search teacher"
                            prefix={<Search size={16} className="text-gray-400" />}
                            className="h-10 w-64 border-gray-100 bg-white rounded-md"
                        />
                    </div>
                    <Button
                        type="primary"
                        icon={<Plus size={16} />}
                        className="flex items-center gap-2 h-10 bg-[#52c41a] border-none hover:bg-[#73d13d] rounded-md font-semibold"
                        onClick={() => setIsAddTeacherModalOpen(true)}
                    >
                        Create Teacher
                    </Button>
                </div>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <Table
                    columns={columns}
                    dataSource={teachers}
                    pagination={{
                        current: page,
                        pageSize: 10,
                        total: teachersApi?.data?.total,
                        showSizeChanger: false,
                        onChange: (p) => setPage(p),
                    }}
                    className="admin-teachers-table"
                    rowClassName="border-b last:border-0 border-gray-50"
                    rowKey="_id"
                />
            </div>

            {/* Modals */}
            <ImportExcelModal open={isImportModalOpen} onCancel={() => setIsImportModalOpen(false)} />
            <AddTeacherModal
                refetch={refetch}
                open={isAddTeacherModalOpen}
                onCancel={() => setIsAddTeacherModalOpen(false)}
            />
            <TeacherDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                teacher={selectedTeacher}
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
            <EditTeacherModal
                refetch={refetch}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                teacher={selectedTeacher}
                students={students}
            />
        </div>
    );
};

export default AdminTeachers;
