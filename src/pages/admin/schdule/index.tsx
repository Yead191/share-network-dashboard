import { useState } from 'react';
import { Table, Button, Input, Modal, message, Popover, Select } from 'antd';
import { Search, Plus, Calendar, MapPin, Eye, Edit, Trash2, Filter as FilterIcon, Clock, CheckCircle2 } from 'lucide-react';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import AddClassScheduleModal from '../../../components/modals/admin/AddClassScheduleModal';
import ClassScheduleDetailsModal from '../../../components/modals/admin/ClassScheduleDetailsModal';
import {
    useDeleteClassScheduleMutation,
    useGetClassScheduleQuery,
} from '../../../redux/apiSlices/admin/adminClassScheduleApi';
import { useGetUserGroupsQuery, useGetUserTracksQuery } from '../../../redux/apiSlices/admin/adminStudentApi';
import moment from 'moment';
import { toast } from 'sonner';
import Spinner from '../../../components/shared/Spinner';

const AdminSchedule = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroup, setFilterGroup] = useState<string | undefined>(undefined);
    const [filterTrack, setFilterTrack] = useState<string | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

    // API CALLS
    const { data: scheduleApi, isLoading, isFetching, refetch } = useGetClassScheduleQuery({
        page: page,
        limit: 10,
        searchTerm: searchTerm,
        userGroup: filterGroup,
        userGroupTrack: filterTrack,
        filterType: activeTab
    });
    const { data: userGroupsApi } = useGetUserGroupsQuery({});
    const { data: userTracksApi } = useGetUserTracksQuery({});

    const userGroups = userGroupsApi?.data;
    const userTracks = userTracksApi?.data;
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
        location: item?.location,
        target: item,
        status: `${item?.status === true ? 'Active' : 'Inactive'}`,
        slideUrl: item?.slideUrl,
        file: item?.file,
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
    if (isLoading || isFetching) {
        return <Spinner />
    }

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
                    <Popover
                        content={
                            <div className="w-64 space-y-4 p-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Target Group
                                    </label>
                                    <Select
                                        placeholder="Select Group"
                                        className="w-full h-10"
                                        value={filterGroup}
                                        onChange={(v) => setFilterGroup(v)}
                                        allowClear
                                        options={userGroups?.map((group: any) => ({
                                            value: group._id,
                                            label: group.name,
                                        }))}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Category (Track)
                                    </label>
                                    <Select
                                        placeholder="Select Track"
                                        className="w-full h-10"
                                        value={filterTrack}
                                        onChange={(v) => setFilterTrack(v)}
                                        allowClear
                                        options={userTracks?.map((track: any) => ({
                                            value: track._id,
                                            label: track.name,
                                        }))}
                                    />
                                </div>
                                <div className="pt-2 flex justify-between gap-3">
                                    <Button
                                        className="flex-1 h-9 rounded-lg text-xs font-medium border-gray-200"
                                        onClick={() => {
                                            setFilterGroup(undefined);
                                            setFilterTrack(undefined);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        }
                        title={
                            <div className="px-2 py-1.5 border-b border-gray-100 mb-2">
                                <span className="font-bold text-gray-800">Filter Schedule</span>
                            </div>
                        }
                        trigger="click"
                        placement="bottomRight"
                        overlayClassName="filter-popover"
                    >
                        <Button
                            icon={<FilterIcon className="w-4 h-4" />}
                            className={`h-10 px-6 border-gray-200 text-gray-600 font-semibold flex items-center gap-2 rounded-lg shadow-sm transition-all ${filterGroup || filterTrack ? 'bg-blue-50 border-blue-200 text-blue-600' : ''
                                }`}
                        >
                            Filter
                        </Button>
                    </Popover>
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

            {/* Tab Filter */}
            <div className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-xl w-fit">
                <button
                    onClick={() => { setActiveTab('upcoming'); setPage(1); }}
                    className={`
                        relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                        transition-all duration-300 ease-out cursor-pointer
                        ${activeTab === 'upcoming'
                            ? 'bg-white text-blue-600 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                        }
                    `}
                >
                    <Clock size={15} className={activeTab === 'upcoming' ? 'text-blue-500' : 'text-gray-400'} />
                    Upcoming
                    {activeTab === 'upcoming' && scheduleApi?.pagination?.total != null && (
                        <span className="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                            {scheduleApi.pagination.total}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => { setActiveTab('completed'); setPage(1); }}
                    className={`
                        relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                        transition-all duration-300 ease-out cursor-pointer
                        ${activeTab === 'completed'
                            ? 'bg-white text-emerald-600 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                        }
                    `}
                >
                    <CheckCircle2 size={15} className={activeTab === 'completed' ? 'text-emerald-500' : 'text-gray-400'} />
                    Completed
                    {activeTab === 'completed' && scheduleApi?.pagination?.total != null && (
                        <span className="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {scheduleApi.pagination.total}
                        </span>
                    )}
                </button>
            </div>

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
