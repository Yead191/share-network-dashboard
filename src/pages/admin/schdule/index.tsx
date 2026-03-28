import { useState } from 'react';
import { Table, Button, Input, Modal, message } from 'antd';
import { Search, Plus, Calendar, MapPin, Eye, Edit, Trash2, Filter as FilterIcon } from 'lucide-react';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import AddClassScheduleModal from '../../../components/modals/admin/AddClassScheduleModal';
import ClassScheduleDetailsModal from '../../../components/modals/admin/ClassScheduleDetailsModal';
import {
    useDeleteClassScheduleMutation,
    useGetClassScheduleQuery,
} from '../../../redux/apiSlices/admin/adminClassScheduleApi';
import moment from 'moment';
import { toast } from 'sonner';

const AdminSchedule = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    // API CALLS
    const { data: scheduleApi, refetch } = useGetClassScheduleQuery({ page: page, limit: 10, searchTerm: searchTerm });
    const [deleteSchedule] = useDeleteClassScheduleMutation();

    const scheduleData = scheduleApi?.data?.map((item: any) => ({
        _id: item?._id,
        key: item?._id,
        title: item?.title,
        description: item?.description,
        classDate: item?.classDate,
        date: moment(item?.classDate).format('DD/MM/YYYY'),
        time: moment(item?.classDate).format('hh:mm A'),
        userGroup: item?.userGroup,
        teacher: item?.teacher,
        userGroupTrack: item?.userGroupTrack,
        virtualClass: item?.virtualClass,
        target: item,
        location: item?.location,
        status: `${item?.status === true ? 'Active' : 'Inactive'}`,
    }));

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Delete Schedule',
            content: 'Are you sure you want to delete this schedule?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    toast.promise(deleteSchedule({ id }).unwrap(), {
                        loading: 'Deleting schedule...',
                        success: (res: any) => {
                            if (res?.success) {
                                refetch();
                            }
                            return res?.message || 'Schedule deleted successfully';
                        },
                        error: (err: any) => err?.message || 'Failed to delete schedule',
                    });
                } catch (error: any) {
                    message.error(error?.data?.message || 'Something went wrong');
                }
            },
        });
    };

    const columns = [
        {
            title: 'CLASS',
            key: 'class',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{record.title}</p>
                        <p className="text-xs text-gray-400">
                            {record.description?.length > 50
                                ? `${record.description.slice(0, 50)}...`
                                : record.description}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: 'DATE & TIME',
            key: 'dateTime',
            render: (_: any, record: any) => (
                <div className="text-sm">
                    <p className="font-medium text-gray-800">{record.date}</p>
                    <p className="text-gray-400">{record.time}</p>
                </div>
            ),
        },
        {
            title: 'TARGET',
            dataIndex: 'target',
            key: 'target',
            render: (tags: { userGroupTrack: { name: string }; userGroup: { _id: string; name: string }[] }) => (
                <div className="flex flex-wrap gap-1">
                    <p className="px-2.5 py-1 bg-gray-50 text-gray-400 text-[10px] rounded-full border border-gray-100 uppercase tracking-tighter">
                        {tags?.userGroupTrack?.name}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {tags?.userGroup?.map((tag: { _id: string; name: string }) => (
                            <span
                                key={tag?._id}
                                className="px-2.5 py-1 bg-gray-50 text-gray-400 text-[10px] rounded-full border border-gray-100 uppercase tracking-tighter"
                            >
                                {tag?.name}
                            </span>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            title: 'LOCATION',
            dataIndex: 'location',
            key: 'location',
            render: (text: string) => (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => (
                <div className="flex items-center gap-2 px-3 py-1 border border-green-200 rounded-lg bg-green-50 text-green-600 text-xs font-medium cursor-pointer w-fit">
                    {text}
                </div>
            ),
        },
        {
            title: 'ACTION',
            key: 'action',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-2">
                    <Button
                        icon={<Eye size={16} />}
                        className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 border-none shadow-none bg-transparent"
                        onClick={() => {
                            setSelectedSchedule(record);
                            setIsDetailsModalOpen(true);
                        }}
                    >
                        View
                    </Button>
                    <Button
                        icon={<Edit size={16} />}
                        className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-green-500 border-none shadow-none bg-transparent"
                        onClick={() => {
                            setSelectedSchedule(record);
                            setIsAddModalOpen(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<Trash2 size={16} />}
                        className="flex items-center justify-center gap-1.5 text-sm text-red-500 hover:bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 h-auto transition-colors"
                        onClick={() => handleDelete(record._id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <section className="space-y-6">
            <div className="flex justify-between items-center">
                <HeaderTitle title="Class Schedule" />
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                        <Input
                            placeholder="Search materials"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 pl-10 bg-[#F9FAFB] border-none shadow-none w-64"
                            style={{ backgroundColor: 'white' }}
                        />
                    </div>
                    <Button
                        icon={<FilterIcon className="w-4 h-4" />}
                        className="h-10 px-6 border-gray-200 text-gray-600 font-medium flex items-center gap-2 rounded-lg"
                    >
                        Filter
                    </Button>
                    <Button
                        icon={<Plus className="w-4 h-4" />}
                        className="h-10 px-6 bg-[#22C55E] text-white hover:bg-[#1ea34d] border-none font-medium flex items-center gap-2 rounded-lg"
                        onClick={() => {
                            setSelectedSchedule(null);
                            setIsAddModalOpen(true);
                        }}
                    >
                        Add Schedule
                    </Button>
                </div>
            </div>

            {/* <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        <FilterIcon size={18} className="text-gray-400" />
                    </div>
                    <Select
                        placeholder="All Groups"
                        className="w-48 h-10"
                        options={[{ value: 'all', label: 'All Groups' }]}
                    />
                    <Select
                        placeholder="Select option"
                        className="w-48 h-10"
                        options={[{ value: 'option1', label: 'Option 1' }]}
                    />
                    <button className="text-gray-800 font-medium px-6 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        Clear Filters
                    </button>
                </div>
            </div> */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={scheduleData}
                    pagination={{
                        current: page,
                        pageSize: 10,
                        total: scheduleApi?.pagination?.total,
                        showSizeChanger: false,
                        onChange: (page) => setPage(page),
                    }}
                    className="schedule-table"
                />
            </div>

            <AddClassScheduleModal
                open={isAddModalOpen}
                onCancel={() => {
                    setIsAddModalOpen(false);
                    setSelectedSchedule(null);
                }}
                refetch={refetch}
                selectedSchedule={selectedSchedule}
            />

            <ClassScheduleDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                data={selectedSchedule}
            />
        </section>
    );
};

export default AdminSchedule;
