import { useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { Eye, Plus, Edit, Trash2 } from 'lucide-react';
import AddReportModal from '../../../components/modals/mentor/AddReportModal';
import ReportDetailsModal from '../../../components/modals/mentor/ReportDetailsModal';
import EditReportModal from '../../../components/modals/mentor/EditReportModal';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import {
    useGetWeeklyReportsQuery,
    useDeleteWeeklyReportMutation,
} from '../../../redux/apiSlices/mentor/weeklyReportApi';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import { toast } from 'sonner';

const WeeklyReport = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const { data, refetch } = useGetWeeklyReportsQuery(undefined);
    const weeklyReportsData = data?.data?.reports || [];
    const { data: profileData } = useProfileQuery(undefined);
    const [deleteReport] = useDeleteWeeklyReportMutation();

    const assignedStudent = profileData?.data?.assignedStudents;

    const handleDelete = async (id: string) => {
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

    const columns = [
        {
            title: 'Student Name',
            dataIndex: 'studentId',
            key: 'studentName',
            render: (student: any) => (
                <span className="text-gray-600 font-medium">
                    {student?.firstName} {student?.lastName}
                </span>
            ),
        },
        {
            title: 'Duration',
            key: 'duration',
            render: (_: any, record: any) => (
                <span className="text-gray-500">
                    {new Date(record.weekStartDate).toLocaleDateString()} -{' '}
                    {new Date(record.weekEndDate).toLocaleDateString()}
                </span>
            ),
        },
        {
            title: 'Attendance',
            dataIndex: 'isPresent',
            key: 'attendance',
            render: (isPresent: boolean) => (
                <span className={isPresent ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                    {isPresent ? 'Present' : 'Absent'}
                </span>
            ),
        },
        {
            title: 'Hard Outcomes',
            dataIndex: 'achievedHardOutcomes',
            key: 'hardOutcomes',
            align: 'center' as const,
            render: (val: string[]) => <span className="text-gray-600 font-semibold">{val?.length || 0}</span>,
        },
        {
            title: 'Soft Skills',
            dataIndex: 'softSkillImprovements',
            key: 'improvements',
            align: 'center' as const,
            render: (val: string[]) => <span className="text-gray-600 font-semibold">{val?.length || 0}</span>,
        },
        {
            title: 'Skill Tracked',
            dataIndex: ['goalSheet', 'skillName'],
            key: 'skillsTracked',
            render: (val: string) => <span className="text-gray-600">{val || 'N/A'}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-2">
                    <Button
                        icon={<Eye className="w-4 h-4" />}
                        onClick={() => {
                            setSelectedReport(record);
                            setIsDetailsModalOpen(true);
                        }}
                        className="flex items-center justify-center text-gray-400 border-gray-200 hover:text-primary hover:border-primary transition-colors h-9 w-9 rounded-lg"
                    />
                    <Button
                        icon={<Edit className="w-4 h-4" />}
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

    return (
        <section className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <HeaderTitle title="Weekly Reporting" />
                    <p className="text-gray-500 mt-1">Log your hours and submit student progress reports.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="h-10 px-6 rounded-lg bg-gray-50 border border-[#d9d9d9] text-[#666] flex items-center font-medium"
                >
                    <span className="flex items-center">
                        <Plus className="w-4 h-4 mr-1" /> Add Report
                    </span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={weeklyReportsData}
                    rowKey="_id"
                    pagination={{ pageSize: 7, hideOnSinglePage: true }}
                    className=""
                />
            </div>

            <AddReportModal
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                assignedStudent={assignedStudent}
                refetch={refetch}
            />

            <ReportDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                data={selectedReport}
            />

            <EditReportModal
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                data={selectedReport}
                assignedStudent={assignedStudent}
                refetch={refetch}
            />
        </section>
    );
};

export default WeeklyReport;
