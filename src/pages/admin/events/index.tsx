import { useState } from 'react';
import { Table, Button, Input, Modal, message } from 'antd';
import { Search, Filter, Plus, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import AddEventModal from '../../../components/modals/admin/AddEventModal';
import EventDetailsModal from '../../../components/modals/admin/EventDetailsModal';
import { useDeleteEventsMutation, useGetEventsQuery } from '../../../redux/apiSlices/admin/adminEventsApi';
import { toast } from 'sonner';
import moment from 'moment';

const AdminEvents = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    // API CALLS
    const { data: eventsApi, refetch } = useGetEventsQuery({ page: page, limit: 10, searchTerm: searchTerm });
    const [deleteEvents] = useDeleteEventsMutation();
   
    const eventsData = eventsApi?.data?.data?.map((item: any) => ({
        _id: item?._id,
        key: item?._id,
        title: item?.title,
        description: item?.description,
        type: item?.type,
        location: item?.location,
        targetGroup: item?.targetGroup,
        targetUser: item?.targetUser,
        date: moment(item?.date).format('YYYY-MM-DD'),
        students:item?.studentAssigned ||[]
    }));

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Delete Material',
            content: 'Are you sure you want to delete this material?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    toast.promise(deleteEvents({ id }).unwrap(), {
                        loading: 'Deleting material...',
                        success: (res: any) => {
                            if (res?.success) {
                                refetch();
                            }
                            return res?.message || 'material deleted successfully';
                        },
                        error: (err: any) => err?.message || 'Failed to delete material',
                    });
                } catch (error: any) {
                    message.error(error?.data?.message || 'Something went wrong');
                }
            },
        });
    };
    const columns = [
        {
            title: 'EVENT',
            key: 'event',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100 shadow-sm">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-[13px]">{record.title}</p>
                        <p className="text-xs text-gray-400">{record.description}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'DATE & LOCATION',
            key: 'dateLocation',
            render: (_: any, record: any) => (
                <div>
                    <p className="font-semibold text-gray-800 text-[12px]">{record.date}</p>
                    <p className="text-[11px] text-gray-400">{record.location}</p>
                </div>
            ),
        },
        {
            title: 'TYPE',
            dataIndex: 'type',
            key: 'type',
            render: (text: string) => (
                <span className="px-3 py-1 bg-blue-50 text-blue-500 text-[11px] rounded-full border border-blue-100 font-medium">
                    {text}
                </span>
            ),
        },
        {
            title: 'TARGET',
            dataIndex: 'targetGroup',
            key: 'targetGroup',
            render: (target: { name: string; _id: string }) => (
                <div className="flex gap-2">
                    <span
                        key={target?._id}
                        className="px-3 py-1 bg-gray-50 text-gray-400 text-[11px] rounded-full border border-gray-100 font-medium"
                    >
                        {target?.name}
                    </span>
                </div>
            ),
        },
        {
            title: 'ACTION',
            key: 'action',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-2.5">
                    <Button
                        icon={<Eye size={16} />}
                        className="flex items-center justify-center gap-1.5 text-[11px] text-gray-600 hover:!text-blue-500 border-none shadow-none bg-[#F9FAFB] px-3 py-1.5 h-auto font-medium"
                        onClick={() => {
                            setSelectedEvent(record);
                            setIsDetailsModalOpen(true);
                        }}
                    >
                        View
                    </Button>
                    <Button
                        icon={<Edit size={16} />}
                        className="flex items-center justify-center gap-1.5 text-[11px] text-gray-600 hover:!text-green-500 border-none shadow-none bg-[#F9FAFB] px-3 py-1.5 h-auto font-medium"
                        onClick={() => {
                            setSelectedEvent(record);
                            setIsAddModalOpen(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDelete(record._id)}
                        className="flex items-center justify-center gap-1.5 text-[11px] text-red-500 hover:!bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 h-auto font-medium shadow-none"
                    >
                        Remove
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <section className="space-y-6">
            <div className="flex justify-between items-center">
                <HeaderTitle title="Event Management" />
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                        <Input
                            placeholder="Search events"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 pl-10 bg-white border border-gray-100 shadow-sm w-72 rounded-lg"
                        />
                    </div>
                    <Button
                        icon={<Filter className="w-4 h-4" />}
                        className="h-10 px-6 border-gray-100 text-gray-600 font-semibold flex items-center gap-2 rounded-lg shadow-sm"
                    >
                        Filter
                    </Button>
                    <Button
                        icon={<Plus className="w-4 h-4" />}
                        className="h-10 px-6 bg-[#22C55E] text-white hover:!bg-[#1ea34d] border-none font-semibold flex items-center gap-2 rounded-lg shadow-sm"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Create New Event
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={eventsData}
                    pagination={{
                        current: page,
                        pageSize: 10,
                        total: eventsApi?.data?.total,
                        showSizeChanger: false,
                        onChange: (page) => setPage(page),
                    }}
                    className="events-table"
                />
            </div>

            <AddEventModal
                open={isAddModalOpen}
                onCancel={() => {
                    setIsAddModalOpen(false);
                    setSelectedEvent(null);
                }}
                refetch={refetch}
                selectedEvent={selectedEvent}
            />

            <EventDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedEvent(null);
                }}
                data={selectedEvent}
            />
        </section>
    );
};

export default AdminEvents;
