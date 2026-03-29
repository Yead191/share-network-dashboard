import { useState } from 'react';
import { Table, Input, Button, Avatar, Select } from 'antd';
import { IoEyeOutline } from 'react-icons/io5';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import StudentDetailsModal from '../../../components/modals/teacher/StudentDetailsModal';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import { useGetMyStudentsQuery } from '../../../redux/apiSlices/teacher/homeSlice';
import { getImageUrl } from '../../../utils/getImageUrl';
import { useGetUserGroupsQuery } from '../../../redux/apiSlices/admin/adminStudentApi';

export interface StudentData {
    key: string;
    name: string;
    email: string;
    contact: string;
    group: { name: string }[];
    track: string | null;
    joined: string;
    status: string;
    avatar: string;
}

const MyStudent = () => {
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
    const { data, isLoading, isFetching } = useGetMyStudentsQuery({ page: page, limit: 10, searchTerm: searchText, userGroup: selectedGroup });
    const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { data: userGroups } = useGetUserGroupsQuery({ page: 1, limit: 100 });


    const mockData = data?.data.map((student) => ({
        key: student._id,
        name: student.name,
        email: student.email,
        contact: student.mobileNumber,
        group: student.userGroup,
        track: student.userGroupTrack?.name || null,
        joined: student.createdAt,
        status: student.verified ? 'Active' : 'Inactive',
        avatar: getImageUrl(student.profile!) || 'https://via.placeholder.com/150',
    })) || [];

    const columns: ColumnsType = [
        {
            title: 'STUDENT NAME',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <Avatar src={record.avatar} size={40} className="border border-gray-100" />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 leading-none mb-1">{text}</span>
                        <span className="text-gray-400 text-xs">{record.email}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'CONTACT',
            dataIndex: 'contact',
            key: 'contact',
            render: (text) => <span className="text-gray-600 font-medium">{text || 'N/A'}</span>,
        },
        {
            title: 'GROUP',
            dataIndex: 'group',
            key: 'group',
            render: (text) => {
                const groupName = Array.isArray(text) && text.length > 0 ? text : [];

                return groupName?.length ? groupName.map((group: any, index: number) => (
                    <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#F3F4F6] text-[#6B7280]"
                    >
                        {group?.name}
                    </span>
                )) : (
                    <span className="text-gray-400 text-xs">N/A</span>
                )

            },
        },
        {
            title: 'TRACK',
            dataIndex: 'track',
            key: 'track',
            render: (text) => {
                const trackName = text ? text : null;


                return trackName ? (
                    <span
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#E0F2FE] text-[#0284C7]"
                    >
                        {trackName}
                    </span>
                ) : (
                    <span className="text-gray-400 text-xs">N/A</span>
                );
            },
        },
        {
            title: 'JOINED',
            dataIndex: 'joined',
            key: 'joined',
            render: (text) => <span className="text-gray-600 font-medium">{new Date(text).toLocaleDateString()}</span>,
        },
        // {
        //     title: 'STATUS',
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: (status: string) => (
        //         <Select
        //             defaultValue={status}
        //             style={{ width: 100 }}
        //             options={[
        //                 { value: 'Active', label: 'Active' },
        //                 { value: 'Inactive', label: 'Inactive' },
        //             ]}
        //             className={status === 'Active' ? 'text-green-600' : 'text-red-600'}
        //         />
        //     ),
        // },
        {
            title: 'ACTION',
            key: 'action',
            render: (_, record) => (


                <Button
                    icon={<IoEyeOutline size={16} />}
                    onClick={() => {
                        setSelectedStudent(record as any);
                        setIsModalVisible(true);
                    }}
                    className="flex items-center gap-2 border-gray-200 text-gray-600 px-4 h-9 rounded-lg hover:text-gray-900"
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <div className="">
            <div className="flex justify-between items-center mb-6">
                <HeaderTitle title="My Student" />
                <div className="flex gap-4">
                    <Input
                        placeholder="Search student"
                        onChange={(e) => setSearchText(e.target.value)}
                        prefix={<SearchOutlined className="text-gray-400 text-lg" />}
                        className="w-72 rounded-lg border-gray-200"
                        style={{ height: '42px' }}
                    />
                    <Select
                        placeholder="Filter by Group"
                        className="w-full md:w-48 h-10 rounded-lg"
                        allowClear
                        onChange={setSelectedGroup}
                        suffixIcon={<FilterOutlined className="text-gray-400" />}
                    >
                        {userGroups?.data?.map((group: any) => (
                            <Select.Option key={group._id} value={group._id}>
                                {group.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100  overflow-hidden shadow-sm">
                <Table
                    columns={columns}
                    loading={isLoading || isFetching}
                    dataSource={mockData}
                    pagination={{ pageSize: 10, onChange: (page) => setPage(page), total: data?.pagination.total, current: data?.pagination.page, }}
                    className="student-table"
                    rowClassName="hover:bg-gray-50/50 transition-colors"
                    onRow={() => ({
                        className: 'h-[72px]',
                    })}
                />
            </div>

            <StudentDetailsModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                student={selectedStudent}
            />
        </div>
    );
};

export default MyStudent;
