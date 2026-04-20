import { useState } from 'react';
import { Table, Button, Input, Tag, Tooltip } from 'antd';
import { Search, Calendar, MapPin, Eye, Clock, CheckCircle2, ExternalLink, Download } from 'lucide-react';
import moment from 'moment';

import GroupScheduleModal from '../../../components/modals/mentor-coordinator/GroupScheduleModal';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import Spinner from '../../../components/shared/Spinner';
import { getImageUrl } from '../../../utils/getImageUrl';

import { useGetClassesScheduleQuery } from '../../../redux/apiSlices/coordinator/groupSchedsuleSlice';
import { useGetprofileQuery } from '../../../redux/apiSlices/students/overview.slice';

const GroupSchedulePage = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
    const { data: userProfile, isLoading: isProfileLoading } = useGetprofileQuery({});
    const user = userProfile?.data?.data ?? userProfile?.data ?? userProfile;

    const { data: scheduleApi, isLoading, isFetching } = useGetClassesScheduleQuery({
        page: page,
        limit: 10,
        searchTerm: searchTerm,
        userGroup: user?.userGroup?.map((group: any) => group._id),
        filterType: activeTab,
    });

    const pagination = scheduleApi?.pagination;
    const scheduleData = scheduleApi?.data?.map((item: any) => ({
        ...item,
        key: item._id,
        date: moment(item.classDate).format('DD/MM/YYYY'),
        time: moment(item.classDate).format('hh:mm A'),
    })) || [];

    const handleViewDetails = (record: any) => {
        setSelectedSchedule(record);
        setIsModalOpen(true);
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
            key: 'location',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{record.location || 'N/A'}</span>
                </div>
            ),
        },
        {
            title: 'GROUPS',
            key: 'group',
            render: (_: any, record: any) => (
                <div className="flex flex-wrap gap-1">
                    {Array.isArray(record.userGroup) ? (
                        record.userGroup.map((g: any) => (
                            <Tag key={g._id} color="blue" className="m-0 text-[10px]">
                                {g.name}
                            </Tag>
                        ))
                    ) : (
                        record.group && <Tag color="blue" className="m-0 text-[10px]">{record.group}</Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'STATUS',
            key: 'status',
            render: (_: any, record: any) => (
                <div className={`
                    flex items-center gap-2 px-3 py-1 border rounded-lg text-xs font-medium w-fit
                    ${record.status ? 'border-green-200 bg-green-50 text-green-600' : 'border-gray-200 bg-gray-50 text-gray-600'}
                `}>
                    {record.status ? 'Active' : 'Inactive'}
                </div>
            ),
        },
        {
            title: 'ACTION',
            key: 'action',
            render: (_: any, record: any) => (
                <Button
                    icon={<Eye size={16} />}
                    className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 border-none shadow-none bg-transparent"
                    onClick={() => handleViewDetails(record)}
                >
                    View
                </Button>
            ),
        },
    ];

    if (isLoading || isProfileLoading) return <Spinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <HeaderTitle title="Group Schedule" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Tab Filter */}
                <div className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-xl w-fit">
                    <button
                        onClick={() => { setActiveTab('upcoming'); setPage(1); }}
                        className={`
                            relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                            transition-all duration-300 ease-out cursor-pointer
                            ${activeTab === 'upcoming'
                                ? 'bg-white text-blue-600 shadow-sm'
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
                                ? 'bg-white text-emerald-600 shadow-sm'
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

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    <Input
                        placeholder="Search Schedule"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-10 pl-10 bg-white border-gray-200 rounded-xl hover:border-blue-400 focus:border-blue-500 transition-all shadow-sm"
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
                        onChange: (p) => setPage(p),
                    }}
                    className="schedule-table"
                />
            </div>

            <GroupScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                schedule={selectedSchedule}
            />
        </div>
    );
};

export default GroupSchedulePage;
