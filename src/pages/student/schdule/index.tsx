import { useState } from 'react';
import { Table, Button, Input, Tag, Tooltip } from 'antd';
import { Search, Calendar, MapPin, Eye, Clock, CheckCircle2, ExternalLink, Download } from 'lucide-react';
import { getImageUrl } from '../../../utils/getImageUrl';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import ClassScheduleDetailsModal from '../../../components/modals/admin/ClassScheduleDetailsModal';
import moment from 'moment';
import { useGetStudentClassScheduleQuery } from '../../../redux/apiSlices/students/classSlice';
import { useGetprofileQuery } from '../../../redux/apiSlices/students/overview.slice';
import Spinner from '../../../components/shared/Spinner';

const StudentSchedule = () => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
    const { data } = useGetprofileQuery({});
    const user = data?.data?.data ?? data?.data ?? data;
    const userGroup = user?.userGroup?.[0]?._id;
    // console.log(userGroup);
    const { data: scheduleApi, isLoading, isFetching } = useGetStudentClassScheduleQuery({
        page: page,
        limit: 10,
        searchTerm: searchTerm,
        userGroup: userGroup,
        filterType: activeTab,
    }, {
        skip: !userGroup,
    });
    const pagination = scheduleApi?.pagination;

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
        slideUrl: item?.slideUrl,
        file: item?.file,
    }));

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
                                ? record.description.slice(0, 50) + '...'
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
            title: 'MATERIALS',
            key: 'materials',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-2">
                    {record.slideUrl ? (
                        <Tooltip title="View Slides">
                            <a
                                href={record.slideUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </Tooltip>
                    ) : (
                        <div className="p-2 rounded-lg bg-gray-50 text-gray-300">
                            <ExternalLink size={16} />
                        </div>
                    )}
                    {record.file ? (
                        <Tooltip title="Download Materials">
                            <a
                                href={getImageUrl(record.file)}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                            >
                                <Download size={16} />
                            </a>
                        </Tooltip>
                    ) : (
                        <div className="p-2 rounded-lg bg-gray-50 text-gray-300">
                            <Download size={16} />
                        </div>
                    )}
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
            title: 'Target Group',
            dataIndex: 'userGroup',
            key: 'userGroup',
            render: (userGroup: { _id: string; name: string }[]) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {userGroup?.map((group) => (
                        <Tag key={group._id} color="blue">
                            {group.name}
                        </Tag>
                    ))}
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
                </div>
            ),
        },
    ];

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <section className="space-y-6">
            <div className="flex justify-between items-center">
                <HeaderTitle title="Class Schedule" />
            </div>
            <div className='flex justify-between items-center'>

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
                        {activeTab === 'upcoming' && pagination?.total != null && (
                            <span className="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                                {pagination.total}
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
                        {activeTab === 'completed' && pagination?.total != null && (
                            <span className="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                {pagination.total}
                            </span>
                        )}
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    <Input
                        placeholder="Search Schedule"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-10 pl-10 bg-[#F9FAFB] border-none shadow-none w-64"
                        style={{ backgroundColor: 'white' }}
                        allowClear
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={scheduleData}
                    loading={isFetching}
                    pagination={{
                        current: page,
                        pageSize: 10,
                        total: pagination?.total,
                        showSizeChanger: false,
                        onChange: (page) => setPage(page),
                    }}
                    className="schedule-table"
                />
            </div>

            <ClassScheduleDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                data={selectedSchedule}
            />
        </section>
    );
};

export default StudentSchedule;
