import { useState } from 'react';
import { Table, Input, Button, Avatar, Select } from 'antd';
import { IoEyeOutline } from 'react-icons/io5';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import { useGetStudentsForTeacherQuery, } from '../../../redux/apiSlices/admin/adminStudentApi';
import StudentDetailsModal from '../../../components/modals/admin/StudentDetailsModal';
import { useGetprofileQuery } from '../../../redux/apiSlices/students/overview.slice';
import Spinner from '../../../components/shared/Spinner';

import { useDebounce } from '../../../hooks/useDebounce';

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
    const { data: user, isLoading: userLoading, } = useGetprofileQuery({});
    const [searchTerm, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
    const [selectedStatus, setSelectedStatus] = useState('');

    const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    
    const userGroups = user?.data?.userGroup || [];
    console.log(userGroups)
    // const { data, isLoading, isFetching } = useGetMyStudentsQuery({ page: page, limit: 10, searchTerm: searchText, userGroup: selectedGroup });
    const {
        data: studentsApi,
        isLoading: isStudentsLoading,
    } = useGetStudentsForTeacherQuery({ 
        page, 
        searchTerm: debouncedSearchTerm, 
        limit: 10, 
        selectedGroup: selectedGroup ?? userGroups?.map((group: any) => group._id), 
        selectedStatus 
    },
        { skip: !userGroups?.length }
    );


    const columns: ColumnsType = [
        {
            title: 'STUDENT NAME',
            dataIndex: 'name',
            key: 'name',
            render: (_text, record) => (
                <div className="flex items-center gap-3">
                    <Avatar src={record?.profile} size={40} className="border border-gray-100" />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 leading-none mb-1">{`${record?.firstName} ${record?.lastName}`}</span>
                        <span className="text-gray-400 text-xs">{record.email}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'CONTACT',
            dataIndex: 'contact',
            key: 'contactNumber',
            render: (_text, record) => <span className="text-gray-600 font-medium">{record.contactNumber || 'N/A'}</span>,
        },
        {
            title: 'GROUP',
            dataIndex: 'group',
            key: 'group',
            render: (_, record) => {
                const groupName = Array.isArray(record?.userGroup) && record?.userGroup?.length > 0 ? record?.userGroup : [];

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
            render: (_, record) => {
                const trackName = record?.userGroupTrack?.name;


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
            render: (_, record) => <span className="text-gray-600 font-medium">{new Date(record?.createdAt).toLocaleDateString()}</span>,
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => <span className="text-gray-600 font-medium">{record.status}</span>,
        },
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

    if (userLoading || isStudentsLoading) {
        return <Spinner />
    }
    return (
        <div className="">
            <div className="flex justify-between items-center mb-6">
                <HeaderTitle title="My Student" />
                <div className="flex gap-4">
                    <Input
                        placeholder="Search student"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setPage(1);
                        }}
                        prefix={<SearchOutlined className="text-gray-400 text-lg" />}
                        className="w-72 rounded-lg border-gray-200"
                        style={{ height: '42px' }}
                        allowClear
                    />
                    <Select
                        placeholder="Filter by Status"
                        className="h-10 w-40"
                        allowClear
                        onChange={(value) => {
                            setSelectedStatus(value);
                            setPage(1);
                        }}
                        options={[
                            { label: 'All', value: '' },
                            { label: 'Pending', value: 'PENDING' },
                            { label: 'Active', value: 'ACTIVE' },
                            { label: 'Non Active', value: 'NON_ACTIVE' },
                            { label: 'Alumni Graduated', value: 'ALUMNI_GRADUATED' },
                        ]}
                    />
                    <Select
                        placeholder="Filter by Group"
                        className="w-full md:w-48 h-10 rounded-lg"
                        allowClear
                        onChange={setSelectedGroup}
                        suffixIcon={<FilterOutlined className="text-gray-400" />}
                        loading={userLoading}
                    >
                        {userGroups?.map((group: any) => (
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
                    loading={isStudentsLoading}
                    dataSource={studentsApi?.data}
                    pagination={{ pageSize: 10, onChange: (page) => setPage(page), total: studentsApi?.data?.pagination?.total, current: studentsApi?.data?.pagination?.page }}
                    className="student-table"
                    rowClassName="hover:bg-gray-50/50 transition-colors"
                    onRow={() => ({
                        className: 'h-[72px]',
                    })}
                />
            </div>

            <StudentDetailsModal
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                student={selectedStudent}
                isTeacherModal={true}
            />
        </div>
    );
};

export default MyStudent;
