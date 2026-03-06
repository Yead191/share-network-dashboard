import { useState } from 'react';
import { Table, Button, Space, Tag, Avatar, Modal, Input } from 'antd';
import { Eye, Edit2, Trash2, User, Plus, Search } from 'lucide-react';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import {
    useGetCoordinatorQuery,
    useGetMentorsQuery,
    useDeleteCoordinatorMutation,
} from '../../../redux/apiSlices/admin/adminCoordinatorApi';
import CreateCoordinatorModal from '../../../components/modals/admin/CreateCoordinatorModal';
import CoordinatorDetailsModal from '../../../components/modals/admin/CoordinatorDetailsModal';
import EditCoordinatorModal from '../../../components/modals/admin/EditCoordinatorModal';
import { toast } from 'sonner';
import { imageUrl } from '../../../redux/api/baseApi';

export default function AdminCoordinator() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCoordinator, setSelectedCoordinator] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // API CALLS
    const { data: coordinatorApi, isLoading, refetch } = useGetCoordinatorQuery({ page, searchTerm });
    const { data: mentorsApi } = useGetMentorsQuery({});
    const [deleteCoordinator] = useDeleteCoordinatorMutation();

    const coordinators = coordinatorApi?.data?.data || [];
    const pagination = coordinatorApi?.data?.pagination;
    const allMentors = mentorsApi?.data?.mentors || [];

    console.log('coordinatorApi', coordinators);

    const columns = [
        {
            title: 'COORDINATOR',
            dataIndex: 'name',
            key: 'name',
            render: (_: string, record: any) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={imageUrl + record.profile}
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
            title: 'CONTACT',
            dataIndex: 'contactNumber',
            key: 'contact',
            render: (contact: string) => <span className="text-gray-500 font-medium">{contact || 'N/A'}</span>,
        },
        {
            title: 'LOCATION',
            dataIndex: 'location',
            key: 'location',
            render: (location: string) => <span className="text-gray-500 font-medium">{location || 'N/A'}</span>,
        },
        {
            title: 'ROLE',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => <span className="text-gray-500 font-medium">{role || 'N/A'}</span>,
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
                            setSelectedCoordinator(record);
                            setIsDetailsModalOpen(true);
                        }}
                    >
                        View
                    </Button>
                    <Button
                        icon={<Edit2 size={14} />}
                        className="flex items-center gap-2 border-gray-200 text-gray-700 hover:text-black font-medium h-9 rounded-md"
                        onClick={() => {
                            setSelectedCoordinator(record);
                            setIsEditModalOpen(true);
                        }}
                    >
                        Edit
                    </Button>
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
            title: 'Are you sure you want to remove this coordinator?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Remove',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    toast.promise(deleteCoordinator(id).unwrap(), {
                        loading: 'Removing coordinator...',
                        success: (res: any) => {
                            if (res?.success) {
                                refetch();
                            }
                            return res?.message || 'Coordinator removed successfully';
                        },
                        error: (err: any) => err?.data?.message || err?.message || 'Failed to remove coordinator',
                    });
                } catch (error: any) {
                    toast.error('Something went wrong');
                }
            },
        });
    };

    return (
        <div className="">
            {/* Management Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-0 gap-4">
                <HeaderTitle title="Coordinator Management" />
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        type="primary"
                        icon={<Plus size={16} />}
                        className="flex items-center gap-2 h-10 bg-[#52c41a] border-none hover:bg-[#73d13d] rounded-md font-semibold"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Create Coordinator
                    </Button>
                    <div className="relative">
                        <Input
                            placeholder="Search Coordinators...."
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
                    dataSource={coordinators}
                    loading={isLoading}
                    pagination={{
                        total: pagination?.totalItems,
                        current: pagination?.currentPage,
                        pageSize: 10,
                        onChange: (page) => {
                            setPage(page);
                        },
                    }}
                    rowKey="_id"
                    className="coordinator-management-table"
                    rowClassName="hover:bg-gray-50/50 transition-colors"
                />
            </div>

            {/* Modals */}
            <CreateCoordinatorModal
                open={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                refetch={refetch}
            />

            <CoordinatorDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                coordinator={selectedCoordinator}
            />

            <EditCoordinatorModal
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                refetch={refetch}
                coordinator={selectedCoordinator}
                mentors={allMentors}
            />
        </div>
    );
}
