import { Button, Select, Input, Tag, Table, DatePicker, Avatar, Radio } from 'antd';
import { Info, FileText, Save, Search, User, ClipboardList } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    useGetAllClassesQuery,
    useGetAttendanceLogsQuery,
    useTakeAttendanceMutation,
    useUpdateIndividualAttendanceMutation,
} from '../../../../redux/apiSlices/admin/adminStudentApi';
import { useGetAllStudentsQuery } from '../../../../redux/apiSlices/admin/adminTeachersApi';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { imageUrl } from '../../../../redux/api/baseApi';
import Spinner from '../../../../components/shared/Spinner';

const TakeAttendance = () => {
    const [viewMode, setViewMode] = useState<'take' | 'logs'>('take');
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

    // Attendance records state for Take mode: { [studentId]: { status, note } }
    const [attendanceRecords, setAttendanceRecords] = useState<Record<string, { status: string; note: string }>>({});

    // Attendance records state for Logs mode: { [logId]: { status, note } }
    const [logEdits, setLogEdits] = useState<Record<string, { status: string; note: string }>>({});

    // API calls
    const { data: studentsApi, isLoading: studentsLoading } = useGetAllStudentsQuery({ page, searchTerm });
    const { data: classesApi, isLoading: classesLoading } = useGetAllClassesQuery({});
    const [submitAttendance, { isLoading: isSubmitting }] = useTakeAttendanceMutation();
    const [updateIndividualAttendance] = useUpdateIndividualAttendanceMutation();

    const allStudents = studentsApi?.data?.data || [];
    const classOptions = classesApi?.data?.map((item: any) => ({
        value: item._id,
        label: item.title,
    }));
    const {
        data: attendanceLogsApi,
        isLoading: attendanceLogsLoading,
        refetch,
    } = useGetAttendanceLogsQuery({
        classId: selectedClass || '',
        date: selectedDate,
    });
    const attendanceLogs = attendanceLogsApi?.data?.[0]?.records || [];
    // console.log(attendanceLogs);

    // Initialize attendance records when students are loaded or search changes
    useEffect(() => {
        if (allStudents.length > 0) {
            const initialRecords = { ...attendanceRecords };
            allStudents.forEach((student: any) => {
                if (!initialRecords[student._id]) {
                    initialRecords[student._id] = { status: 'absent', note: '' };
                }
            });
            setAttendanceRecords(initialRecords);
        }
    }, [allStudents]);

    // Initialize log edits when logs are loaded
    useEffect(() => {
        if (attendanceLogs.length > 0) {
            const initialLogEdits: Record<string, { status: string; note: string }> = {};
            attendanceLogs.forEach((log: any) => {
                initialLogEdits[log._id] = { status: log.status, note: log.note || '' };
            });
            setLogEdits(initialLogEdits);
        } else {
            setLogEdits({});
        }
    }, [attendanceLogs]);

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceRecords((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], status },
        }));
    };

    const handleNoteChange = (studentId: string, note: string) => {
        setAttendanceRecords((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], note },
        }));
    };

    const handleLogStatusChange = (logId: string, status: string) => {
        setLogEdits((prev) => ({
            ...prev,
            [logId]: { ...prev[logId], status },
        }));
    };

    const handleLogNoteChange = (logId: string, note: string) => {
        setLogEdits((prev) => ({
            ...prev,
            [logId]: { ...prev[logId], note },
        }));
    };

    const handleUpdateIndividualLog = async (logRecord: any) => {
        const edits = logEdits[logRecord._id];
        if (!edits) return;

        const payload = {
            date: selectedDate,
            classId: selectedClass,
            // Per the provided example, the API expects the subdocument's _id in the studentId field
            studentId: logRecord._id,
            status: edits.status,
            note: edits.note,
        };

        toast.promise(
            updateIndividualAttendance(payload)
                .unwrap()
                .then(() => refetch()),
            {
                loading: 'Updating attendance...',
                success: 'Attendance updated successfully!',
                error: (err: any) => err?.data?.message || 'Failed to update attendance',
            },
        );
    };

    const setAllStatus = (status: string) => {
        const newRecords = { ...attendanceRecords };
        allStudents.forEach((student: any) => {
            newRecords[student._id] = { ...newRecords[student._id], status };
        });
        setAttendanceRecords(newRecords);
        toast.success(`All students set to ${status}`);
    };

    const handleSaveAttendance = async () => {
        if (!selectedClass) {
            toast.error('Please select a class first');
            return;
        }

        const payload = {
            date: selectedDate,
            classId: selectedClass,
            records: allStudents.map((student: any) => ({
                studentId: student._id,
                status: (attendanceRecords[student._id]?.status || 'absent').toLowerCase(),
                note: attendanceRecords[student._id]?.note || '',
            })),
        };

        toast.promise(
            submitAttendance(payload)
                .unwrap()
                .then(() => refetch()),
            {
                loading: 'Saving attendance...',
                success: (res) => {
                    return res?.data?.message || 'Attendance saved successfully!';
                },
                error: (err: any) => err?.data?.message || 'Failed to save attendance',
            },
        );
    };

    const columns = [
        {
            title: 'STUDENT',
            key: 'student',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3 py-1">
                    <Avatar
                        src={record.profile ? `${imageUrl}${record.profile}` : null}
                        icon={<User size={16} />}
                        className="bg-gray-100"
                    />
                    <div>
                        <div className="font-semibold text-gray-700">
                            {record.firstName} {record.lastName}
                        </div>
                        <div className="text-xs text-gray-400">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'GROUP/TRACK',
            key: 'groups',
            render: (_: any, record: any) => (
                <div className="flex flex-wrap gap-2">
                    {record.userGroup?.map((group: any) => (
                        <Tag
                            key={group._id}
                            className="bg-blue-50 border-blue-100 text-blue-500 rounded-full px-3 py-0.5 text-xs font-medium"
                        >
                            {group.name}
                        </Tag>
                    ))}
                    {record.userGroupTrack && (
                        <Tag className="bg-purple-50 border-purple-100 text-purple-500 rounded-full px-3 py-0.5 text-xs font-medium">
                            {record.userGroupTrack.name}
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'STATUS',
            key: 'status',
            width: 180,
            render: (_: any, record: any) => (
                <Select
                    value={attendanceRecords[record._id]?.status || 'absent'}
                    onChange={(val) => handleStatusChange(record._id, val)}
                    className="w-full h-10"
                    options={[
                        { label: 'Present', value: 'present' },
                        { label: 'Absent', value: 'absent' },
                        { label: 'Late', value: 'late' },
                    ]}
                    style={{ borderRadius: '8px' }}
                />
            ),
        },
        {
            title: 'NOTES',
            key: 'notes',
            render: (_: any, record: any) => (
                <Input
                    placeholder="Optional"
                    value={attendanceRecords[record._id]?.note || ''}
                    onChange={(e) => handleNoteChange(record._id, e.target.value)}
                    className="h-10 border-gray-100 bg-gray-50/50 rounded-lg"
                />
            ),
        },
    ];

    const logColumns = [
        {
            title: 'STUDENT',
            key: 'student',
            render: (_: any, record: any) => {
                const displayName =
                    record.studentId?.name ||
                    `${record.studentId?.firstName || ''} ${record.studentId?.lastName || ''}`.trim() ||
                    'Unknown';
                return (
                    <div className="flex items-center gap-3 py-1">
                        <Avatar
                            src={record.studentId?.profile ? `${imageUrl}${record.studentId.profile}` : null}
                            icon={<User size={16} />}
                            className="bg-gray-100"
                        />
                        <div>
                            <div className="font-semibold text-gray-700">{displayName}</div>
                            <div className="text-xs text-gray-400">{record.studentId?.email}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'STATUS',
            key: 'status',
            width: 180,
            render: (_: any, record: any) => (
                <Select
                    value={logEdits[record._id]?.status || record.status}
                    onChange={(val) => handleLogStatusChange(record._id, val)}
                    className="w-full h-10"
                    options={[
                        { label: 'Present', value: 'present' },
                        { label: 'Absent', value: 'absent' },
                        { label: 'Late', value: 'late' },
                    ]}
                    style={{ borderRadius: '8px' }}
                />
            ),
        },
        {
            title: 'NOTES',
            key: 'notes',
            render: (_: any, record: any) => (
                <Input
                    placeholder="Optional"
                    value={logEdits[record._id]?.note !== undefined ? logEdits[record._id].note : record.note || ''}
                    onChange={(e) => handleLogNoteChange(record._id, e.target.value)}
                    className="h-10 border-gray-100 bg-gray-50/50 rounded-lg"
                />
            ),
        },
        {
            title: 'ACTIONS',
            key: 'actions',
            width: 120,
            render: (_: any, record: any) => {
                const isChanged =
                    logEdits[record._id]?.status !== record.status ||
                    logEdits[record._id]?.note !== (record.note || '');
                return (
                    <Button
                        type={isChanged ? 'primary' : 'default'}
                        disabled={!isChanged}
                        onClick={() => handleUpdateIndividualLog(record)}
                        className={`rounded-lg ${isChanged ? 'bg-[#52c41a] border-none text-white hover:bg-[#45a016]' : 'text-gray-400'}`}
                    >
                        Update
                    </Button>
                );
            },
        },
    ];

    if (attendanceLogsLoading) {
        return <Spinner />;
    }

    return (
        <div className="pb-10">
            {/* Top Filters & Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        prefix={<Search size={18} className="text-gray-400" />}
                        className="w-64 h-11 rounded-lg border-gray-100"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select
                        placeholder="Select Class"
                        value={selectedClass}
                        loading={classesLoading}
                        className="w-64 h-11"
                        options={classOptions}
                        onChange={(val) => setSelectedClass(val)}
                        allowClear
                    />
                    <DatePicker
                        className="h-11 w-44 rounded-lg border-gray-100"
                        value={selectedDate ? dayjs(selectedDate) : null}
                        onChange={(date) => setSelectedDate(date ? date.format('YYYY-MM-DD') : '')}
                    />
                    <Button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedClass(null);
                            setPage(1);
                        }}
                        className="h-11 px-6 border-gray-100 bg-gray-50 text-gray-600 font-medium rounded-lg hover:bg-gray-100"
                    >
                        Reset
                    </Button>
                </div>
                <div className="flex items-center gap-4">
                    <Radio.Group
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        className="h-11 flex items-center bg-gray-100 p-1 rounded-lg"
                        buttonStyle="solid"
                    >
                        <Radio.Button
                            value="take"
                            className={`h-9 px-4 border-none rounded-md ${
                                viewMode === 'take' ? 'bg-white shadow-sm text-primary' : 'bg-transparent text-gray-500'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <FileText size={16} />
                                Take Attendance
                            </span>
                        </Radio.Button>
                        <Radio.Button
                            value="logs"
                            className={`h-9 px-4 border-none rounded-md ${
                                viewMode === 'logs' ? 'bg-white shadow-sm text-primary' : 'bg-transparent text-gray-500'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <ClipboardList size={16} />
                                View Logs
                            </span>
                        </Radio.Button>
                    </Radio.Group>
                </div>
            </div>

            {/* Info Alert */}
            {!selectedClass && (
                <div className="bg-[#fff9ec] border border-[#ffecd2] rounded-xl p-4 flex items-start gap-3 mb-8">
                    <div className="mt-0.5">
                        <div className="w-6 h-6 rounded-full border border-gray-800 flex items-center justify-center text-gray-800">
                            <Info size={14} />
                        </div>
                    </div>
                    <p className="text-[#856404] text-[15px] leading-relaxed">
                        Please select a <span className="font-bold">Class</span> and{' '}
                        <span className="font-bold">Date</span> before{' '}
                        {viewMode === 'take' ? 'taking attendance' : 'viewing logs'}.
                    </p>
                </div>
            )}

            {selectedClass && viewMode === 'take' && (
                <>
                    {/* Bulk Actions & Save Button */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 animate-fadeIn">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => setAllStatus('present')}
                                className="h-10 border-blue-100 bg-blue-50 text-blue-600 font-medium rounded-lg px-5 hover:bg-blue-100"
                            >
                                Set all: Present
                            </Button>
                            <Button
                                onClick={() => setAllStatus('absent')}
                                className="h-10 border-red-100 bg-red-50 text-red-600 font-medium rounded-lg px-5 hover:bg-red-100"
                            >
                                Set all: Absent
                            </Button>
                            <Button
                                onClick={() => setAllStatus('late')}
                                className="h-10 border-yellow-100 bg-yellow-50 text-yellow-600 font-medium rounded-lg px-5 hover:bg-yellow-100"
                            >
                                Set all: Late
                            </Button>
                        </div>
                        <Button
                            type="primary"
                            icon={<Save size={18} />}
                            onClick={handleSaveAttendance}
                            loading={isSubmitting}
                            className="h-11 bg-[#52c41a] border-none hover:bg-[#45a016] px-8 rounded-lg font-semibold flex items-center gap-2"
                        >
                            Submit Attendance
                        </Button>
                    </div>

                    {/* Attendance Table */}
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm animate-fadeIn">
                        <Table
                            columns={columns}
                            dataSource={allStudents}
                            loading={studentsLoading}
                            pagination={{
                                current: page,
                                total: studentsApi?.data?.pagination?.total,
                                pageSize: 10,
                                onChange: (page) => setPage(page),
                            }}
                            rowKey="_id"
                            className="attendance-table"
                            rowClassName="hover:bg-gray-50/50 transition-colors"
                        />
                    </div>
                </>
            )}

            {selectedClass && viewMode === 'logs' && (
                <div className="animate-fadeIn">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <h3 className="text-lg font-bold text-gray-800">
                            Attendance Logs for {dayjs(selectedDate).format('MMMM D, YYYY')}
                        </h3>
                    </div>

                    {attendanceLogs.length > 0 ? (
                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <Table
                                columns={logColumns}
                                dataSource={attendanceLogs}
                                pagination={{ pageSize: 10 }}
                                rowKey="_id"
                                className="attendance-table"
                                rowClassName="hover:bg-gray-50/50 transition-colors"
                            />
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <ClipboardList size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">No logs found</h3>
                            <p className="text-gray-500">
                                There are no attendance logs saved for the selected class and date.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TakeAttendance;
