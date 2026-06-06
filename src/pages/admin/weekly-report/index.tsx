import { useState } from 'react';
import { Table, Button, Input, Popconfirm, Tooltip, Select, DatePicker } from 'antd';
import { Eye, Search, Edit, Trash2 } from 'lucide-react';
import { Dayjs } from 'dayjs';
import WeeklyReportDetailsModal from '../../../components/modals/admin/WeeklyReportDetailsModal';
import EditReportModal from '../../../components/modals/mentor/EditReportModal';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import {
    useGetWeeklyReportQuery,
    useDeleteWeeklyReportMutation,
} from '../../../redux/apiSlices/admin/adminWeeklyReport';
import { useGetStudentsQuery, useGetUserGroupsQuery } from '../../../redux/apiSlices/admin/adminStudentApi';
import moment from 'moment';
import Spinner from '../../../components/shared/Spinner';
import { toast } from 'sonner';

const AdminWeeklyReport = () => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

    // API CALLS
    const {
        data: weeklyReportApi,
        isLoading,
        refetch,
    } = useGetWeeklyReportQuery({
        page,
        limit: 10,
        searchTerm,
        selectedGroup,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD') || undefined,
        endDate: dateRange?.[1]?.format('YYYY-MM-DD') || undefined,
    });
    const { data: userGroupsApi, isLoading: isUserGroupsLoading } = useGetUserGroupsQuery({});
    const userGroups = userGroupsApi?.data;



    const [deleteReport] = useDeleteWeeklyReportMutation();
    const { data: studentsApi } = useGetStudentsQuery({ page: 1, limit: 1000 });
    const allStudents = studentsApi?.data?.students || [];

    const handleDelete = async (id: string) => {
        console.log(id)
        try {
            toast.promise(deleteReport(id).unwrap(), {
                loading: 'Deleting report...',
                success: (res) => {
                    refetch();
                    return res.message || 'Report deleted successfully';
                },
                error: (err) => {
                    return err?.data?.message || 'Failed to delete report';
                },
            });
        } catch (error) {
            console.error('Failed to delete report', error);
        }
    };

    const reportsData = weeklyReportApi?.data?.reports?.map((item: any) => ({
        ...item,
        key: item?._id,
        studentName: `${item?.studentId?.firstName || 'N/A'} ${item?.studentId?.lastName || ''}`,
        attendance: item?.isPresent ? 'Present' : 'Absent',
        hardOutcomesCount: item?.achievedHardOutcomes?.length || 0,
        improvementsCount: item?.softSkillImprovements?.length || 0,
        summaryDuration: `${moment(item?.weekStartDate).format('DD/MM/YYYY')} - ${moment(item?.weekEndDate).format('DD/MM/YYYY')}`,
    }));

    const columns = [
        {
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName',
            render: (text: string) => <span className="text-[#333] font-medium">{text}</span>,
        },
        {
            title: 'Duration',
            dataIndex: 'summaryDuration',
            key: 'duration',
            render: (text: string) => <span className="text-[#666]">{text}</span>,
        },
        {
            title: 'Attendance',
            dataIndex: 'attendance',
            key: 'attendance',
            render: (text: string) => <span className="text-[#666]">{text}</span>,
        },
        // {
        //     title: 'Hard Outcomes',
        //     dataIndex: 'hardOutcomesCount',
        //     key: 'hardOutcomes',
        //     align: 'center' as const,
        //     render: (val: number) => <span className="text-[#666] font-semibold">{val}</span>,
        // },
        // {
        //     title: 'Improvements',
        //     dataIndex: 'improvementsCount',
        //     key: 'improvements',
        //     align: 'center' as const,
        //     render: (val: number) => <span className="text-[#666] font-semibold">{val}</span>,
        // },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            render: (text: string) => {
                const truncatedText =
                    text?.length > 50 ? `${text.slice(0, 50)}.....` : text;

                return (
                    <Tooltip title={text}>
                        <span className="text-[#666] cursor-pointer">
                            {truncatedText}
                        </span>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Skills Tracked',
            key: 'skillsTracked',
            align: 'center' as const,
            render: (_: any, record: any) => (
                <span className="text-[#666] font-semibold">
                    {record.goalSheet?.skillName || 'N/A'}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-2">
                    <Button
                        icon={<Eye className="w-4 h-4 text-[#666]" />}
                        onClick={() => {
                            setSelectedReport(record);
                            setIsDetailsModalOpen(true);
                        }}
                        className="flex items-center justify-center text-gray-400 border-gray-200 hover:text-primary hover:border-primary transition-colors h-9 w-9 rounded-lg"
                    />
                    <Button
                        icon={<Edit className="w-4 h-4 text-[#666]" />}
                        onClick={() => {
                            setSelectedReport(record);
                            setIsEditModalOpen(true);
                        }}
                        className="flex items-center justify-center text-gray-400 border-gray-200 hover:text-blue-500 hover:border-blue-500 transition-colors h-9 w-9 rounded-lg"
                    />
                    <Popconfirm
                        title="Delete the report"
                        description="Are you sure to delete this report?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<Trash2 className="w-4 h-4" />}
                            danger
                            className="flex items-center justify-center h-9 w-9 rounded-lg"
                        />
                    </Popconfirm>
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
                <HeaderTitle title="Weekly Report" />
                <div className="flex gap-3 w-full md:w-auto">
                    <Select
                        placeholder="Filter by Group"
                        className="h-10 w-48"
                        allowClear
                        loading={isUserGroupsLoading}
                        onChange={(value) => {
                            setSelectedGroup(value);
                            setPage(1);
                        }}
                        options={userGroups?.map((group: any) => ({
                            label: group.name,
                            value: group._id,
                        }))}
                    />
                    <DatePicker.RangePicker
                        className="h-10"
                        format="DD/MM/YYYY"
                        placeholder={['Start Date', 'End Date']}
                        value={dateRange}
                        onChange={(dates) => {
                            setDateRange(dates as [Dayjs, Dayjs] | null);
                            setPage(1);
                        }}
                        allowClear
                    />
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                        <Input
                            placeholder="Search reports..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 pl-10 border-none shadow-none"
                            style={{ backgroundColor: '#fff' }}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#FAFAFA] shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={reportsData}
                    pagination={{
                        current: page,
                        pageSize: 10,
                        total: weeklyReportApi?.data?.pagination?.total,
                        showSizeChanger: false,
                        onChange: (page) => setPage(page),
                    }}
                    className="weekly-report-table"
                    rowClassName="hover:bg-[#F9FAFB] transition-colors"
                />
            </div>

            <WeeklyReportDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => {
                    setSelectedReport(null);
                    setIsDetailsModalOpen(false)
                }}
                data={selectedReport}
            />

            <EditReportModal
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                data={selectedReport}
                assignedStudent={allStudents}
                refetch={refetch}
            />
        </section>
    );
};

export default AdminWeeklyReport;
