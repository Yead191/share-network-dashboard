import { useState } from 'react';
import { Table, Button, Select, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FilterOutlined, EyeOutlined, SearchOutlined, DesktopOutlined, EnvironmentOutlined } from '@ant-design/icons';

import GroupScheduleModal from '../../../components/modals/mentor-coordinator/GroupScheduleModal';
import HeaderTitle from '../../../components/shared/HeaderTitle';

import {
    useGetClassesScheduleQuery,
    useUpdateStatusMutation,
} from '../../../redux/apiSlices/coordinator/groupSchedsuleSlice';

interface GroupSchedule {
    key: string;
    title: string;
    description: string;
    date: string;
    time: string;
    group: string;
    track: string;
    location: string;
    status: boolean;
    sources: string;
}

const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

const GroupSchedulePage = () => {
    const { data, isLoading } = useGetClassesScheduleQuery(undefined);

    const [updateStatus] = useUpdateStatusMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

    const Schedule: GroupSchedule[] =
        data?.data?.map((schedule: any) => ({
            key: schedule._id,
            title: schedule.title,
            description: schedule.description,
            date: schedule.classDate,
            time: schedule.time,
            group: schedule.group,
            //   track: schedule.track,
            location: schedule.location,
            status: schedule.status === true || schedule.status === 'true',
            //   sources: schedule.sources,
        })) || [];

    const handleViewDetails = (id: string) => {
        setSelectedScheduleId(id);
        setIsModalOpen(true);
    };

    const selectedSchedule = Schedule.find((s) => s.key === selectedScheduleId) || null;

    const columns: ColumnsType<GroupSchedule> = [
        {
            title: 'TITLE',
            dataIndex: 'title',
            key: 'title',
            render: (text) => (
                <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border">
                        <DesktopOutlined className="text-gray-400" />
                    </div>
                    <span className="font-medium text-gray-700">{text}</span>
                </div>
            ),
        },
        {
            title: 'DATE & TIME',
            key: 'dateTime',
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-700">{formatDate(record.date)}</span>
                    {record.time && <span className="text-gray-400 text-sm">{record.time}</span>}
                </div>
            ),
        },
        {
            title: 'LOCATION',
            dataIndex: 'location',
            key: 'location',
            render: (text) => (
                <div className="flex items-center gap-2 font-medium text-gray-700">
                    <EnvironmentOutlined className="text-gray-400" />
                    {text}
                </div>
            ),
        },
        // {
        //   title: "STATUS",
        //   dataIndex: "status",
        //   key: "status",
        //   render: (status: boolean, record) => (
        //     <Select
        //       value={status}
        //       style={{ width: 110 }}
        //       options={[
        //         { value: true, label: "Active" },
        //         { value: false, label: "Inactive" },
        //       ]}
        //       onChange={async (value: boolean) => {
        //         try {
        //           await updateStatus({
        //             id: record.key,
        //             status: value,
        //           }).unwrap();

        //           message.success("Status updated");
        //         } catch (err) {
        //           message.error("Failed to update status");
        //         }
        //       }}
        //     />
        //   ),
        // },
        {
            title: 'ACTION',
            key: 'action',
            render: (_, record) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record.key)}
                    className="border-gray-200 hover:border-blue-500 hover:text-blue-500 rounded-lg px-6"
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <HeaderTitle title="Group Schedule" />
                <div className="flex gap-4">
                    <Input
                        placeholder="Search"
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="w-72 rounded-lg h-[40px]"
                    />
                    {/* <Button icon={<FilterOutlined />}>Filter</Button> */}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border">
                <Table
                    columns={columns}
                    dataSource={Schedule}
                    loading={isLoading}
                    rowKey="key"
                    pagination={{ pageSize: 5 }}
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
