import { useState } from 'react';
import { Table, Button, Select, Space, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FilterOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import StudentDetailsModal from '../../../components/modals/mentor-coordinator/StudentDetailsModal';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import { useGetAllMentorsQuery } from '../../../redux/apiSlices/coordinator/overViewSlice';

export interface Student {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profile: string;
}

export interface Mentor {
    key: string;
    name: string;
    email: string;
    company: string;
    jobTitle: string;
    status: 'Active' | 'Inactive';
    assignedStudents: Student[];
}

const Mentors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { data, isLoading } = useGetAllMentorsQuery({
        page,
        limit,
        searchTerm,
        status,
    });

    const [isViewStudentsModalOpen, setIsViewStudentsModalOpen] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

    console.log(data?.data, 'all mentors')
    const mentorsData: Mentor[] =
        data?.data?.mentors?.map((mentor: any) => ({
            key: mentor._id,
            name: mentor.firstName ? `${mentor.firstName} ${mentor.lastName || ''}`.trim() : mentor.name || 'N/A',
            email: mentor.email,
            company: mentor.company || mentor.professionalTitle || 'N/A',
            jobTitle: mentor.professionalTitle || 'N/A',
            location: mentor.address || 'N/A',
            status: mentor.verified ? 'Active' : 'Inactive',
            assignedStudents: mentor.assignedStudents || [],
        })) || [];

    const navigate = useNavigate();

    const handleViewStudents = (mentor: Mentor) => {
        setSelectedMentor(mentor);
        setIsViewStudentsModalOpen(true);
    };

    const handleDetails = (mentor: Mentor) => {
        navigate(`/mentor-coordinator/mentors/${mentor.key}`);
    };

    const columns: ColumnsType<Mentor> = [
        {
            title: 'NAME',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="font-medium text-gray-700">{text}</span>,
        },
        {
            title: 'EMAIL',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'COMPANY',
            dataIndex: 'company',
            key: 'company',
        },
        {
            title: 'JOB TITLE',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
        },
        {
            title: 'LOCATION',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Select
                    defaultValue={status}
                    style={{ width: 110 }}
                    options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Inactive', label: 'Inactive' },
                    ]}
                    className={status === 'Active' ? 'text-green-600' : 'text-red-600'}
                />
            ),
        },
        {
            title: 'ACTION',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewStudents(record)}
                        style={{ backgroundColor: '#007bff' }}
                    >
                        View Students ({record.assignedStudents.length})
                    </Button>

                    <Button onClick={() => handleDetails(record)} className="bg-gray-100 hover:bg-gray-200 border-none">
                        Details
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* ===== Header ===== */}
            <div className="flex justify-between items-center mb-4">
                <HeaderTitle title="Mentors" />
                <div className="flex gap-4">
                    <Input
                        placeholder="Search mentor by name/company..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        allowClear
                        prefix={<SearchOutlined />}
                        style={{ height: '42px' }}
                        className="w-72 rounded-lg"
                    />

                    <Select
                        placeholder="Filter by status"
                        style={{ height: '42px', width: 150 }}
                        allowClear
                        onChange={(value) => {
                            setStatus(value || '');
                            setPage(1);
                        }}
                        suffixIcon={<FilterOutlined className="text-gray-400" />}
                        options={[
                            { value: 'Active', label: 'Active' },
                            { value: 'Inactive', label: 'Inactive' },
                        ]}
                    />
                </div>
            </div>

            {/* ===== Table ===== */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <Table
                    columns={columns}
                    dataSource={mentorsData}
                    loading={isLoading}
                    rowKey="key"
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total: data?.data?.pagination?.total || 0,
                        onChange: (newPage, newLimit) => {
                            setPage(newPage);
                            setLimit(newLimit);
                        },
                    }}
                />
            </div>

            {/* ===== Mentor Details Modal ===== */}
            <StudentDetailsModal
                isOpen={isViewStudentsModalOpen}
                onClose={() => setIsViewStudentsModalOpen(false)}
                mentor={selectedMentor}
            />
        </div>
    );
};

export default Mentors;
