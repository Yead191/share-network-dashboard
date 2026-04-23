import { useState } from 'react';
import { Table, Button, Input, Modal, message } from 'antd';
import { Search, Plus, Calendar, MapPin, Eye, Edit, Trash2, Clock, CheckCircle2, Video } from 'lucide-react';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import {
    useDeleteClassTeacherMutation,
    useGetTeacherClassesQuery,
} from '../../../redux/apiSlices/teacher/homeSlice';
import { useGetprofileQuery } from '../../../redux/apiSlices/students/overview.slice';
import { toast } from 'sonner';
import moment from 'moment';
import TeacherClassDetailsModal from '../../../components/modals/teacher/TeacherClassDetailsModal';
import TeacherCreateClassModal from '../../../components/modals/teacher/TeacherCreateClassModal';

const TeacherClassSchedule = () => {
    const { data: profile } = useGetprofileQuery({});
    const userGroup = profile?.data?.userGroup?.[0]?._id;
    const userGroupTrack = profile?.data?.userGroupTrack?._id;

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<any>(null);

    const { data, isLoading, isFetching, refetch } = useGetTeacherClassesQuery({
        page,
        limit: 10,
        searchTerm,
        filterType: activeTab,
        userGroup,
        ...(userGroupTrack && { userGroupTrack }),
    });

    const [deleteClassTeacher] = useDeleteClassTeacherMutation();

    const scheduleData = data?.data?.map((item: any) => ({
        _id: item._id,
        key: item._id,
        title: item.title,
        description: item.description,
        classDate: item.classDate,
        date: moment(item.classDate).format('DD/MM/YYYY'),
        time: moment(item.classDate).format('hh:mm A'),
        userGroup: item.userGroup,
        userGroupTrack: item.userGroupTrack,
        virtualClass: item.virtualClass,
        location: item.location,
        slideUrl: item.slideUrl,
        file: item.file,
        status: item.published ? 'Active' : 'Inactive',
    }));

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Delete Class',
            content: 'Are you sure you want to delete this class?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    toast.promise(deleteClassTeacher(id).unwrap(), {
                        loading: 'Deleting class...',
                        success: (res: any) => {
                            refetch();
                            return res?.message || 'Class deleted successfully';
                        },
                        error: (err: any) => err?.message || 'Failed to delete class',
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
            key: 'target',
            render: (_: any, record: any) => (
                <div className="flex flex-wrap gap-1">
                    {record.userGroupTrack?.name && (
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-500 text-[10px] rounded-full border border-purple-100 uppercase tracking-tighter">
                            {record.userGroupTrack.name}
                        </span>
                    )}
                    {record.userGroup?.map((g: any) => (
                        <span
                            key={g._id}
                            className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] rounded-full border border-gray-100 uppercase tracking-tighter"
                        >
                            {g.name}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            title: 'LOCATION',
            key: 'location',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    {record.virtualClass ? (
                        <>
                            <Video size={14} className="text-blue-400" />
                            <span className="text-blue-500">Virtual</span>
                        </>
                    ) : (
                        <>
                            <MapPin size={14} className="text-gray-400" />
                            <span>{record.location || '—'}</span>
                        </>
                    )}
                </div>
            ),
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => (
                <div className={`flex items-center gap-2 px-3 py-1 border rounded-lg text-xs font-medium cursor-pointer w-fit ${text === 'Active'
                    ? 'border-green-200 bg-green-50 text-green-600'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                    }`}>
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
                            setSelectedClass(record);
                            setIsDetailsModalOpen(true);
                        }}
                    >
                        View
                    </Button>
                    <Button
                        icon={<Edit size={16} />}
                        className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-green-500 border-none shadow-none bg-transparent"
                        onClick={() => {
                            setSelectedClass(record);
                            setIsCreateModalOpen(true);
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
            {/* Header */}
            <div className="flex justify-between items-center">
                <HeaderTitle title="Class Schedule" />
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                        <Input
                            placeholder="Search classes..."
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="h-10 pl-10 bg-white border-gray-200 w-64"
                        />
                    </div>
                    <Button
                        icon={<Plus className="w-4 h-4" />}
                        className="h-10 px-6 bg-[#22C55E] text-white hover:bg-[#1ea34d] border-none font-medium flex items-center gap-2 rounded-lg"
                        onClick={() => {
                            setSelectedClass(null);
                            setIsCreateModalOpen(true);
                        }}
                    >
                        Add Class
                    </Button>
                </div>
            </div>

            {/* Upcoming / Completed Tabs */}
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
                    {activeTab === 'upcoming' && data?.pagination?.total != null && (
                        <span className="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                            {data.pagination.total}
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
                    {activeTab === 'completed' && data?.pagination?.total != null && (
                        <span className="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {data.pagination.total}
                        </span>
                    )}
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={scheduleData}
                    loading={isLoading || isFetching}
                    pagination={{
                        current: page,
                        pageSize: 10,
                        total: data?.pagination?.total,
                        showSizeChanger: false,
                        onChange: (p) => setPage(p),
                    }}
                    className="schedule-table"
                />
            </div>

            {/* Details Modal */}
            <TeacherClassDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                data={selectedClass}
            />

            {/* Create / Edit Modal */}
            <TeacherCreateClassModal
                open={isCreateModalOpen}
                onCancel={() => {
                    setIsCreateModalOpen(false);
                    setSelectedClass(null);
                }}
                refetch={refetch}
                selectedSchedule={selectedClass}
                teacherUserGroup={userGroup}
                teacherUserGroupTrack={userGroupTrack}
            />
        </section>
    );
};

export default TeacherClassSchedule;
