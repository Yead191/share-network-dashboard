import { useState } from 'react';
import { Table, Button, Input } from 'antd';
import { Search, Calendar, MapPin, Eye, Filter as FilterIcon } from 'lucide-react';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import ClassScheduleDetailsModal from '../../../components/modals/admin/ClassScheduleDetailsModal';
import moment from 'moment';
import { useGetStudentClassScheduleQuery } from '../../../redux/apiSlices/students/classSlice';
import { imageUrl } from '../../../redux/api/baseApi';

const StudentSchedule = () => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    // API CALLS
    const { data: scheduleApi } = useGetStudentClassScheduleQuery({ page: page, limit: 10, searchTerm: searchTerm });
    // console.log('scheduleApi', scheduleApi);

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
                        <p className="text-xs text-gray-400">{record.description}</p>
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
            title: 'Teacher',
            dataIndex: 'teacher',
            key: 'teacher',
            render: (teacher: { profile: string; firstName: string; lastName: string }) => (
                <div className="flex items-center gap-1">
                    {teacher?.profile && (
                        <img
                            className="w-8 h-8 rounded-full"
                            src={
                                teacher?.profile?.startsWith('https')
                                    ? teacher?.profile
                                    : `${imageUrl}${teacher?.profile}`
                            }
                            alt=""
                        />
                    )}

                    <p className=" text-gray-800 text-[10px] ">
                        {' '}
                        <span>{teacher?.firstName} </span> <span>{teacher?.lastName}</span>
                    </p>
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
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={scheduleData}
                    pagination={{
                        current: page,
                        pageSize: 10,
                        total: scheduleApi?.data?.total,
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
