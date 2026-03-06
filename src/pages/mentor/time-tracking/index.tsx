import { Button, Table, Modal, Dropdown } from 'antd';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import { useGetTimeTrackingQuery, useDeleteTimeTrackMutation } from '../../../redux/apiSlices/mentor/timeTrackingApi';
import { useState } from 'react';
import AddTimeTrackModal from './components/AddTimeTrackModal';
import EditTimeTrackModal from './components/EditTimeTrackModal';
import ViewTimeTrackModal from './components/ViewTimeTrackModal';
import dayjs from 'dayjs';
import { Plus, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Spinner from '../../../components/shared/Spinner';

const { confirm } = Modal;

const TimeTracking = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    // api calls
    const { data: userData, isLoading: isUserLoading } = useProfileQuery({});
    const user = userData?.data;
    const { data: timeTrackingData, isLoading: isTimeTrackLoading } = useGetTimeTrackingQuery(user?._id, {
        skip: !user?._id,
    });
    const [deleteTimeTrack] = useDeleteTimeTrackMutation();

    const timeTracking = timeTrackingData?.data || [];
    const assignedStudents = user?.assignedStudents || [];

    const handleDelete = (id: string) => {
        confirm({
            title: 'Are you sure you want to delete this time track?',
            content: 'This action cannot be undone.',
            okText: 'Yes, delete it',
            okType: 'danger',
            cancelText: 'Cancel',
            centered: true,
            onOk: async () => {
                try {
                    await deleteTimeTrack(id).unwrap();
                    toast.success('Time track deleted successfully');
                } catch (error: any) {
                    toast.error(error?.data?.message || 'Failed to delete time track');
                }
            },
        });
    };

    const columns = [
        {
            title: 'Time Type',
            dataIndex: 'timeType',
            key: 'timeType',
            render: (text: string) => <span className="font-semibold text-gray-700">{text}</span>,
        },
        {
            title: 'Student',
            key: 'student',
            render: (_: any, record: any) => (
                <span className="text-gray-700">
                    {record?.studentId ? `${record?.studentId?.firstName} ${record?.studentId?.lastName}` : 'N/A'}
                </span>
            ),
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (date: string) => dayjs(date).format('MMM DD, YYYY hh:mm A'),
        },
        {
            title: 'Hours',
            dataIndex: 'spentHours',
            key: 'spentHours',
            render: (hours: number) => <span className="font-medium">{hours} hrs</span>,
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            render: (text: string) => (
                <span className="text-gray-600 italic">
                    {text && text.length > 50 ? `${text.substring(0, 50)}...` : text || 'N/A'}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center' as const,
            render: (_: any, record: any) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'view',
                                icon: <Eye size={16} />,
                                label: 'View Details',
                                onClick: () => {
                                    setSelectedRecord(record);
                                    setIsViewModalOpen(true);
                                },
                            },
                            {
                                key: 'edit',
                                icon: <Edit size={16} />,
                                label: 'Edit Time Check',
                                onClick: () => {
                                    setSelectedRecord(record);
                                    setIsEditModalOpen(true);
                                },
                            },
                            {
                                key: 'delete',
                                icon: <Trash2 size={16} className="text-red-500" />,
                                label: <span className="text-red-500">Delete</span>,
                                onClick: () => handleDelete(record._id),
                            },
                        ],
                    }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Button type="text" className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={20} />
                    </Button>
                </Dropdown>
            ),
        },
    ];

    if (isUserLoading || isTimeTrackLoading) {
        return <Spinner />;
    }

    return (
        <section className="">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mx-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <HeaderTitle title="Time Tracking" />
                        <Button
                            type="primary"
                            icon={<Plus className="w-4 h-4" />}
                            onClick={() => setIsAddModalOpen(true)}
                            className="h-10 px-6 rounded-lg font-semibold bg-primary border-none hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                            Log Time Track
                        </Button>
                    </div>

                    <Table
                        dataSource={timeTracking}
                        columns={columns}
                        loading={isTimeTrackLoading}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        className="custom-table"
                    />
                </div>
            </div>

            <AddTimeTrackModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                assignedStudents={assignedStudents}
            />

            <EditTimeTrackModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                assignedStudents={assignedStudents}
                data={selectedRecord}
            />

            <ViewTimeTrackModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                data={selectedRecord}
            />
        </section>
    );
};

export default TimeTracking;
