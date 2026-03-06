import { useEffect, useState } from 'react';
import { Input, Button, Table, Badge, DatePicker, Select, Avatar, Space, Typography, Card } from 'antd';
import { SearchOutlined, FilterOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {  StudentAttendance } from '../../../constants/initialStudents';
import { useBulkAttandanceMutation, useGetStudentsOFTeacherQuery } from '../../../redux/apiSlices/teacher/attandanceSlice';
import { getImageUrl } from '../../../utils/getImageUrl';
import { useGetUserGroupsQuery } from '../../../redux/apiSlices/teacher/resourceSlice';
import { toast } from 'sonner';

const { Title } = Typography;
const { Option } = Select;

export default function AttendanceTeacher() {
    const [page,setPage]=useState(1)
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const {data:studentsData, isLoading, isFetching} = useGetStudentsOFTeacherQuery({page: page, limit: 10,...(selectedGroup ? {userGroup: selectedGroup} : {}),searchTerm:searchText});
    const {data:userGroups} = useGetUserGroupsQuery({page:1,limit:10});
    const [studentAttendance]=useBulkAttandanceMutation()
    const [students, setStudents] = useState<StudentAttendance[]>([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const handleStatusChange = (key: string, value: StudentAttendance['status']) => {
        setStudents((prev) => [...prev.map((s) => (s.key === key ? { ...s, status: value } : s))]);
    };

    const handleNotesChange = (key: string, value: string) => {
        setStudents((prev) => [...prev.map((s) => (s.key === key ? { ...s, notes: value } : s))]);
    };

    const markAll = (status: StudentAttendance['status']) => {
        const filteredKeys = students.map((s) => {
            return {
                ...s,
                status
            }
        })
        setStudents(filteredKeys as any);
    };

    const newData = studentsData?.data?.map((stu)=>{
        return {
            key: stu._id,
            name: stu.name,
            description: stu.email,
            groups:stu.userGroup,
            avatar: stu.profile,
            status: '',
            notes: '',
            classId: stu.classId
        }
    })


    const handleSaveAttandance =async () => {
        if(!selectedDate) {
            toast.error('Please select a date');
            return
        }
       const classId = students?.find(s=>s.classId)?.classId;
       const data ={
        date: selectedDate.format('YYYY-MM-DD'),     
        classId,
        records: students?.filter(s=>s.status)?.map((s) => ({
            studentId: s.key,
            status: s.status,
            note: s.notes
        }))
    }
     const {error}=await studentAttendance(data);

     
     if(!error){
        toast.success('Attendance saved successfully')
        return
     }
     toast.error((error as any)?.data?.message || 'Failed to save attendance');
    };

    useEffect(() => {
        setStudents(newData || [] as any);
    }, [studentsData]);

    const stats = {
        total: students.length,
        present: students.filter((s) => s.status === 'present').length,
        late: students.filter((s) => s.status === 'late').length,
        absent: students.filter((s) => s.status === 'absent').length,
    };

    const columns = [
        {
            title: 'NAME',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, record: StudentAttendance) => (
                <Space>
                    <Avatar src={getImageUrl(record.avatar!)} icon={<UserOutlined />} size={40} className="bg-gray-100" />
                    <div>
                        <div className="font-bold text-gray-800">{record.name}</div>
                        <div className="text-xs text-gray-400">{record.description}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'GROUP/TRACK',
            dataIndex: 'groups',
            key: 'groups',
            render: (groups: { name: string , _id: string}[]) => (
                <div className="flex flex-wrap gap-1">
                    {groups?.map((group) => (
                        <Badge
                            key={group._id}
                            count={group.name}
                            style={{
                                backgroundColor: group?.name === 'Skill Path' ? '#E8F5E9' : '#F5F5F5',
                                color: group?.name === 'Skill Path' ? '#4CAF50' : '#888',
                                boxShadow: 'none',
                            }}
                        />
                    ))}
                </div>
            ),
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status: StudentAttendance['status'], record: StudentAttendance) => (
                <Select
                    value={status}
                    placeholder="Select Status"
                    className="w-32 custom-select"
                    onChange={(val) => handleStatusChange(record.key, val)}
                >
                    <Option value="present">Present</Option>
                    <Option value="late">Late</Option>
                    <Option value="absent">Absent</Option>
                    <Option value="excused">Excused</Option>
                </Select>
            ),
        },
        {
            title: 'NOTES',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes: string, record: StudentAttendance) => (
                <Input
                    placeholder="Add notes..."
                    value={notes}
                    onChange={(e) => handleNotesChange(record.key, e.target.value)}
                    className="bg-gray-50 border-none rounded-lg h-9"
                />
            ),
        },
    ];

    return (
        <div className=" min-h-screen animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <Title level={2} className="m-0 !font-heading text-2xl">
                    Attendance
                </Title>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder="Search student"
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="w-full md:w-64 rounded-xl border-none shadow-sm h-11"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Select
                        placeholder="Filter by Group"
                        allowClear
                        className="w-full md:w-48 h-11 custom-filter-select"
                        onChange={(val) => setSelectedGroup(val)}
                        suffixIcon={<FilterOutlined className="text-gray-400" />}
                    >
                        {userGroups?.data?.map((group) => (
                            <Option key={group._id} value={group._id}>
                                {group.name}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Stats and Controls */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <DatePicker
                        value={selectedDate}
                        onChange={(date) => date && setSelectedDate(date)}
                        format="DD MMMM, YYYY"
                        placeholder="Select Date"
                        className="rounded-xl border-none shadow-sm h-11 px-4 min-w-[180px]"
                        suffixIcon={<CalendarOutlined className="text-[#8012FF]" />}
                    />

                    <div className="flex items-center gap-2">
                        <div className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-2 rounded-lg font-bold text-sm border border-[#4CAF50]/10">
                            Total: {stats.total}
                        </div>
                        <div className="bg-[#E3F2FD] text-[#2196F3] px-3 py-2 rounded-lg font-bold text-sm border border-[#2196F3]/10">
                            Present: {stats.present}
                        </div>
                        <div className="bg-[#FFF3E0] text-[#FF9800] px-3 py-2 rounded-lg font-bold text-sm border border-[#FF9800]/10">
                            Late: {stats.late}
                        </div>
                        <div className="bg-[#FFEBEE] text-[#F44336] px-3 py-2 rounded-lg font-bold text-sm border border-[#F44336]/10">
                            Absent: {stats.absent}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        className="bg-white text-gray-700 border border-gray-100 hover:border-[#8012FF]/30 h-10 rounded-lg px-4 font-medium"
                        onClick={() => markAll('present')}
                    >
                        Set all: Present
                    </Button>
                    <Button
                        className="bg-white text-gray-700 border border-gray-100 hover:border-[#8012FF]/30 h-10 rounded-lg px-4 font-medium"
                        onClick={() => markAll('absent')}
                    >
                        Set all: Absent
                    </Button>
                    <Button
                        className="bg-white text-gray-700 border border-gray-100 hover:border-[#8012FF]/30 h-10 rounded-lg px-4 font-medium"
                        onClick={() => markAll('late')}
                    >
                        Set all: Late
                    </Button>
                    <Button
                        className="bg-white text-gray-700 border border-gray-100 hover:border-[#8012FF]/30 h-10 rounded-lg px-4 font-medium"
                        onClick={() => markAll('excused')}
                    >
                        Set all: Excused
                    </Button>
                </div>
            </div>

            {/* Table Area */}
            <Card className="rounded-3xl shadow-sm border-none overflow-hidden custom-table-card">
                <Table loading={isLoading||isFetching} columns={columns} dataSource={students} pagination={{ pageSize: 10,current:page,onChange:(page)=>setPage(page),total:studentsData?.pagination?.total}} className="custom-table" />
            </Card>

            {/* Footer Action */}
            <div className="mt-8 flex justify-end">
                <Button
                    type="primary"
                    className="bg-[#21c35d] hover:!bg-[#21c35d]/90 h-12 rounded-2xl px-12 font-bold text-lg shadow-lg shadow-[#21c35d]/20 flex-center"
                    onClick={handleSaveAttandance}
                >
                    Save Attendance
                </Button>
            </div>
        </div>
    );
}
